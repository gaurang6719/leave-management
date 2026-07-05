const User = require('../models/User');
const Leave = require('../models/Leave');
const Notification = require('../models/Notification');

// @desc    Get all employees with pagination, filtering & search
// @route   GET /api/users
// @access  Private/Admin
const getEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { role: 'Employee' }; // Focus on Employees list, but allow searching all if needed

    // Search by name, email, or employeeCode
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { employeeCode: searchRegex },
        { department: searchRegex },
        { designation: searchRegex },
      ];
    }

    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    const total = await User.countDocuments(query);
    const employees = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: employees.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee
// @route   GET /api/users/:id
// @access  Private/Admin
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee
// @route   POST /api/users
// @access  Private/Admin
const createEmployee = async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    department,
    designation,
    phone,
    employeeCode,
    leaveBalances,
  } = req.body;

  try {
    // Check if email or employeeCode exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: [{ field: 'email', message: 'Email already registered' }],
      });
    }

    const codeExists = await User.findOne({ employeeCode });
    if (codeExists) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: [{ field: 'employeeCode', message: 'Employee code already in use' }],
      });
    }

    const employee = await User.create({
      name,
      email,
      password,
      role: role || 'Employee',
      department: department || '',
      designation: designation || '',
      phone: phone || '',
      employeeCode,
      leaveBalances: leaveBalances || { Casual: 12, Sick: 12, Paid: 12, Emergency: 12, WFH: 12 },
    });

    // Create a greeting notification for employee
    await Notification.create({
      title: 'Welcome to Leave Portal!',
      description: `Hi ${name}, your employee profile has been created successfully. Welcome aboard!`,
      user: employee._id,
    });

    res.status(201).json({
      success: true,
      message: 'Employee profile created successfully',
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        designation: employee.designation,
        phone: employee.phone,
        employeeCode: employee.employeeCode,
        leaveBalances: employee.leaveBalances,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee details
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateEmployee = async (req, res, next) => {
  const {
    name,
    email,
    role,
    department,
    designation,
    phone,
    employeeCode,
    leaveBalances,
  } = req.body;

  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check unique locks
    if (email && email !== employee.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: [{ field: 'email', message: 'Email already registered' }],
        });
      }
      employee.email = email;
    }

    if (employeeCode && employeeCode !== employee.employeeCode) {
      const codeExists = await User.findOne({ employeeCode });
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: [{ field: 'employeeCode', message: 'Employee code already in use' }],
        });
      }
      employee.employeeCode = employeeCode;
    }

    employee.name = name || employee.name;
    employee.role = role || employee.role;
    employee.department = department !== undefined ? department : employee.department;
    employee.designation = designation !== undefined ? designation : employee.designation;
    employee.phone = phone !== undefined ? phone : employee.phone;
    if (leaveBalances !== undefined) {
      employee.leaveBalances = leaveBalances;
      employee.markModified('leaveBalances');
    }

    const updatedEmployee = await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      employee: {
        _id: updatedEmployee._id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        role: updatedEmployee.role,
        department: updatedEmployee.department,
        designation: updatedEmployee.designation,
        phone: updatedEmployee.phone,
        employeeCode: updatedEmployee.employeeCode,
        leaveBalances: updatedEmployee.leaveBalances,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Clean up leaves and notifications associated with employee
    await Leave.deleteMany({ employee: req.params.id });
    await Notification.deleteMany({ user: req.params.id });
    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee profile and associated data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
