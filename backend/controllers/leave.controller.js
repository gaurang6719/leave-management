const Leave = require('../models/Leave');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Apply for a leave
// @route   POST /api/leaves
// @access  Private/Employee
const applyLeave = async (req, res, next) => {
  const { leaveType, startDate, endDate, days, reason } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check overlap with pending or approved leaves
    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);
    const overlappingLeave = await Leave.findOne({
      employee: req.user.id,
      status: { $in: ['Pending', 'Approved'] },
      startDate: { $lte: parsedEnd },
      endDate: { $gte: parsedStart },
    });

    if (overlappingLeave) {
      const statusMsg = overlappingLeave.status.toLowerCase();
      const startStr = new Date(overlappingLeave.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      const endStr = new Date(overlappingLeave.endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      return res.status(400).json({
        success: false,
        message: `You cannot apply for leave on this date. You already have a ${statusMsg} leave request for an overlapping period (from ${startStr} to ${endStr}).`,
      });
    }

    // Check if sufficient type balance is available
    const typeBalance = user.leaveBalances && user.leaveBalances[leaveType] !== undefined
      ? user.leaveBalances[leaveType]
      : 12;

    if (typeBalance < days) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. You requested ${days} days of ${leaveType} leave, but you only have ${typeBalance} days remaining.`,
      });
    }

    const leave = await Leave.create({
      employee: req.user.id,
      leaveType,
      startDate,
      endDate,
      days,
      reason,
      status: 'Pending',
    });

    // Notify Super Admins
    const admins = await User.find({ role: 'Super Admin' });
    const notificationPromises = admins.map((admin) => {
      return Notification.create({
        title: 'New Leave Application',
        description: `${user.name} (${user.employeeCode}) has applied for ${days} day(s) of ${leaveType} leave.`,
        user: admin._id,
      });
    });
    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current employee's leave history
// @route   GET /api/leaves/my-leaves
// @access  Private/Employee
const getMyLeaves = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { employee: req.user.id };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by leaveType
    if (req.query.leaveType) {
      query.leaveType = req.query.leaveType;
    }

    // Search by reason
    if (req.query.search) {
      query.reason = new RegExp(req.query.search, 'i');
    }

    const total = await Leave.countDocuments(query);
    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: leaves.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      leaves,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leave applications (Admin only)
// @route   GET /api/leaves
// @access  Private/Admin
const getAllLeaves = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by leaveType
    if (req.query.leaveType) {
      query.leaveType = req.query.leaveType;
    }

    // Search by employee name/code or reason
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      
      // Find matching employees
      const matchingEmployees = await User.find({
        $or: [
          { name: searchRegex },
          { employeeCode: searchRegex },
        ],
      }).select('_id');

      const employeeIds = matchingEmployees.map((emp) => emp._id);

      query.$or = [
        { employee: { $in: employeeIds } },
        { reason: searchRegex },
      ];
    }

    const total = await Leave.countDocuments(query);
    const leaves = await Leave.find(query)
      .populate('employee', 'name email employeeCode department designation avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: leaves.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      leaves,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit pending leave request
// @route   PUT /api/leaves/:id
// @access  Private/Employee
const updatePendingLeave = async (req, res, next) => {
  const { leaveType, startDate, endDate, days, reason } = req.body;

  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found',
      });
    }

    // Ensure the leave belongs to the current user
    if (leave.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this leave application',
      });
    }

    // Only allow editing pending leaves
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Approved/Rejected/Cancelled leaves cannot be edited. Current status is ${leave.status}`,
      });
    }

    // Check overlap with pending or approved leaves
    const parsedStart = new Date(startDate || leave.startDate);
    const parsedEnd = new Date(endDate || leave.endDate);
    const overlappingLeave = await Leave.findOne({
      _id: { $ne: leave._id },
      employee: req.user.id,
      status: { $in: ['Pending', 'Approved'] },
      startDate: { $lte: parsedEnd },
      endDate: { $gte: parsedStart },
    });

    if (overlappingLeave) {
      const statusMsg = overlappingLeave.status.toLowerCase();
      const startStr = new Date(overlappingLeave.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      const endStr = new Date(overlappingLeave.endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      return res.status(400).json({
        success: false,
        message: `You cannot update to this date period. You already have a ${statusMsg} leave request for an overlapping period (from ${startStr} to ${endStr}).`,
      });
    }

    // Double check user type balance if request days or type changed
    const targetType = leaveType || leave.leaveType;
    const targetDays = days || leave.days;
    const typeBalance = user.leaveBalances && user.leaveBalances[targetType] !== undefined
      ? user.leaveBalances[targetType]
      : 12;

    if (typeBalance < targetDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. You requested ${targetDays} days of ${targetType} leave, but you only have ${typeBalance} days remaining.`,
      });
    }

    leave.leaveType = leaveType || leave.leaveType;
    leave.startDate = startDate || leave.startDate;
    leave.endDate = endDate || leave.endDate;
    leave.days = days || leave.days;
    leave.reason = reason || leave.reason;

    const updatedLeave = await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave application updated successfully',
      leave: updatedLeave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel pending leave request
// @route   POST /api/leaves/:id/cancel
// @access  Private/Employee
const cancelPendingLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found',
      });
    }

    // Ensure the leave belongs to the current user
    if (leave.employee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this leave application',
      });
    }

    // Only allow cancelling pending leaves
    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Only pending leaves can be cancelled. Current status is ${leave.status}`,
      });
    }

    leave.status = 'Cancelled';
    await leave.save();

    // Notify Super Admins
    const admins = await User.find({ role: 'Super Admin' });
    const notificationPromises = admins.map((admin) => {
      return Notification.create({
        title: 'Leave Application Cancelled',
        description: `${req.user.name} has cancelled their pending ${leave.leaveType} leave request.`,
        user: admin._id,
      });
    });
    await Promise.all(notificationPromises);

    res.status(200).json({
      success: true,
      message: 'Leave application cancelled successfully',
      leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject leave request (Admin only)
// @route   POST /api/leaves/:id/approve-reject
// @access  Private/Admin
const approveRejectLeave = async (req, res, next) => {
  const { status, adminRemark } = req.body;

  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found',
      });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Only pending leaves can be approved or rejected. Current status is ${leave.status}`,
      });
    }

    const employee = await User.findById(leave.employee);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee associated with this leave not found',
      });
    }

    if (status === 'Approved') {
      // Check if employee still has enough leave balance for the requested type
      const typeBalance = employee.leaveBalances && employee.leaveBalances[leave.leaveType] !== undefined
        ? employee.leaveBalances[leave.leaveType]
        : 12;

      if (typeBalance < leave.days) {
        return res.status(400).json({
          success: false,
          message: `Cannot approve leave. Employee has insufficient balance (${typeBalance} days of ${leave.leaveType} remaining, requested ${leave.days} days).`,
        });
      }

      // Deduct balance
      employee.leaveBalances[leave.leaveType] -= leave.days;
      employee.markModified('leaveBalances');
      await employee.save();
    }

    leave.status = status;
    leave.adminRemark = adminRemark || '';
    await leave.save();

    // Notify Employee
    await Notification.create({
      title: `Leave Request ${status}`,
      description: `Your request for ${leave.days} day(s) of ${leave.leaveType} leave starting ${new Date(leave.startDate).toLocaleDateString()} has been ${status.toLowerCase()}.${adminRemark ? ` Remark: ${adminRemark}` : ''}`,
      user: leave.employee,
    });

    res.status(200).json({
      success: true,
      message: `Leave request successfully ${status.toLowerCase()}`,
      leave,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & stats
// @route   GET /api/leaves/stats
// @access  Private
const getLeaveStats = async (req, res, next) => {
  try {
    if (req.user.role === 'Super Admin') {
      // Admin dashboard metrics
      const totalEmployees = await User.countDocuments({ role: 'Employee' });
      const pendingCount = await Leave.countDocuments({ status: 'Pending' });
      const approvedCount = await Leave.countDocuments({ status: 'Approved' });
      const rejectedCount = await Leave.countDocuments({ status: 'Rejected' });

      // Leave type distribution
      const typeStats = await Leave.aggregate([
        { $match: { status: 'Approved' } },
        { $group: { _id: '$leaveType', count: { $sum: 1 }, totalDays: { $sum: '$days' } } },
      ]);

      // Leave stats grouped by employee (approved leave days)
      const employeeLeaveStats = await Leave.aggregate([
        { $match: { status: 'Approved' } },
        {
          $group: {
            _id: {
              employeeId: '$employee',
              leaveType: '$leaveType'
            },
            totalDays: { $sum: '$days' },
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id.employeeId',
            foreignField: '_id',
            as: 'employeeInfo'
          }
        },
        { $unwind: '$employeeInfo' },
        {
          $group: {
            _id: '$_id.employeeId',
            employeeName: { $first: '$employeeInfo.name' },
            employeeCode: { $first: '$employeeInfo.employeeCode' },
            totalDays: { $sum: '$totalDays' },
            types: {
              $push: {
                leaveType: '$_id.leaveType',
                days: '$totalDays'
              }
            }
          }
        },
        { $sort: { totalDays: -1 } },
        { $limit: 10 }
      ]);

      // Leave stats grouped by month (last 12 months)
      const monthlyStats = await Leave.aggregate([
        { $match: { status: 'Approved' } },
        {
          $group: {
            _id: {
              year: { $year: '$startDate' },
              month: { $month: '$startDate' }
            },
            totalDays: { $sum: '$days' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Recent activities (last 5 leaves)
      const recentLeaves = await Leave.find()
        .populate('employee', 'name email employeeCode avatar')
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({
        success: true,
        stats: {
          totalEmployees,
          pendingLeaves: pendingCount,
          approvedLeaves: approvedCount,
          rejectedLeaves: rejectedCount,
          typeStats,
          monthlyStats,
          employeeLeaveStats,
          recentLeaves,
        },
      });
    } else {
      // Employee dashboard metrics
      const user = await User.findById(req.user.id);
      const pendingCount = await Leave.countDocuments({ employee: req.user.id, status: 'Pending' });
      const approvedCount = await Leave.countDocuments({ employee: req.user.id, status: 'Approved' });
      const rejectedCount = await Leave.countDocuments({ employee: req.user.id, status: 'Rejected' });

      // Calculate total leave days approved
      const approvedLeavesList = await Leave.find({ employee: req.user.id, status: 'Approved' });
      const totalDaysTaken = approvedLeavesList.reduce((acc, curr) => acc + curr.days, 0);

      // Calculate employee's monthly leave statistics
      const monthlyStats = await Leave.aggregate([
        { $match: { employee: req.user._id, status: 'Approved' } },
        {
          $group: {
            _id: {
              year: { $year: '$startDate' },
              month: { $month: '$startDate' }
            },
            totalDays: { $sum: '$days' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Recent activities (last 5 leaves)
      const recentLeaves = await Leave.find({ employee: req.user.id })
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({
        success: true,
        stats: {
          leaveBalances: user.leaveBalances,
          totalDaysTaken,
          pendingLeaves: pendingCount,
          approvedLeaves: approvedCount,
          rejectedLeaves: rejectedCount,
          monthlyStats,
          recentLeaves,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updatePendingLeave,
  cancelPendingLeave,
  approveRejectLeave,
  getLeaveStats,
};
