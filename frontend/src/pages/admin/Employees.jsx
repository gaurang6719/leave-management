import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, Shield, User, Building2, Calendar, Grid, LayoutList } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import Input from '../../components/common/Input';
import PasswordInput from '../../components/common/PasswordInput';
import Select from '../../components/common/Select';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Avatar from '../../components/common/Avatar';
import useValidator from '../../hooks/useValidator';
import { DEPARTMENTS } from '../../constants';
import {
  getEmployeesList,
  createEmployeeProfile,
  updateEmployeeProfile,
  deleteEmployeeProfile,
} from '../../services/user.service';
import toast from 'react-hot-toast';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  // Modal forms states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeCode: '',
    department: '',
    designation: '',
    phone: '',
    remainingLeaveBalance: 20,
    role: 'Employee',
  });

  // Confirm delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { validator, validateAll, validateField, resetValidation } = useValidator();

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployeesList({ search, page, limit: 8 });
      if (data.success) {
        setEmployees(data.employees);
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load employees list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      employeeCode: '',
      department: '',
      designation: '',
      phone: '',
      role: 'Employee',
      casualBalance: 12,
      sickBalance: 12,
      paidBalance: 12,
      emergencyBalance: 12,
      wfhBalance: 12,
    });
    resetValidation();
    setModalOpen(true);
  };

  const openEditModal = (emp) => {
    setIsEditMode(true);
    setSelectedId(emp._id);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      password: '', // blank password on edit
      employeeCode: emp.employeeCode || '',
      department: emp.department || '',
      designation: emp.designation || '',
      phone: emp.phone || '',
      role: emp.role || 'Employee',
      casualBalance: emp.leaveBalances?.Casual ?? 12,
      sickBalance: emp.leaveBalances?.Sick ?? 12,
      paidBalance: emp.leaveBalances?.Paid ?? 12,
      emergencyBalance: emp.leaveBalances?.Emergency ?? 12,
      wfhBalance: emp.leaveBalances?.WFH ?? 12,
    });
    resetValidation();
    setModalOpen(true);
  };

  const openDeleteDialog = (id) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();

    // Custom validations rules: password is required on create only
    const validationRules = {
      name: 'required|min:2',
      email: 'required|email',
      employeeCode: 'required',
    };

    if (!isEditMode) {
      validationRules.password = 'required|min:6';
    }

    // Run manual checks
    let isValid = true;
    Object.keys(validationRules).forEach((field) => {
      const rule = validationRules[field];
      const val = formData[field];
      if (validator.message(field, val, rule)) {
        isValid = false;
      }
    });

    if (!isValid || !validateAll()) {
      toast.error('Please correct the validation errors');
      return;
    }

    // Construct request payload with nested leaveBalances object
    const payload = {
      name: formData.name,
      email: formData.email,
      employeeCode: formData.employeeCode,
      department: formData.department,
      designation: formData.designation,
      phone: formData.phone,
      role: formData.role,
      leaveBalances: {
        Casual: formData.casualBalance !== '' && formData.casualBalance !== undefined && formData.casualBalance !== null ? Number(formData.casualBalance) : 12,
        Sick: formData.sickBalance !== '' && formData.sickBalance !== undefined && formData.sickBalance !== null ? Number(formData.sickBalance) : 12,
        Paid: formData.paidBalance !== '' && formData.paidBalance !== undefined && formData.paidBalance !== null ? Number(formData.paidBalance) : 12,
        Emergency: formData.emergencyBalance !== '' && formData.emergencyBalance !== undefined && formData.emergencyBalance !== null ? Number(formData.emergencyBalance) : 12,
        WFH: formData.wfhBalance !== '' && formData.wfhBalance !== undefined && formData.wfhBalance !== null ? Number(formData.wfhBalance) : 12,
      }
    };
    if (formData.password) {
      payload.password = formData.password;
    }

    setActionLoading(true);
    try {
      if (isEditMode) {
        const data = await updateEmployeeProfile(selectedId, payload);
        if (data.success) {
          toast.success('Employee updated successfully');
          setModalOpen(false);
          loadEmployees();
        }
      } else {
        const data = await createEmployeeProfile(payload);
        if (data.success) {
          toast.success('Employee created successfully');
          setModalOpen(false);
          loadEmployees();
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Action failed';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      const data = await deleteEmployeeProfile(selectedId);
      if (data.success) {
        toast.success('Employee deleted successfully');
        setDeleteOpen(false);
        loadEmployees();
      }
    } catch (err) {
      toast.error('Failed to delete employee profile');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} src={row.avatar} size="md" />
          <div>
            <p className="font-bold text-zinc-900 dark:text-white leading-tight">{row.name}</p>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">{row.designation || 'Staff Member'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Employee Code',
      render: (row) => <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{row.employeeCode}</span>,
    },
    {
      header: 'Contacts',
      render: (row) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <Mail className="w-3.5 h-3.5" />
            {row.email}
          </div>
          {row.phone && (
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Phone className="w-3.5 h-3.5" />
              {row.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Department',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <Building2 className="w-3 h-3 text-zinc-400" />
          {row.department || 'Operations'}
        </span>
      ),
    },
    {
      header: 'Leave Balances',
      render: (row) => (
        <div className="flex flex-col gap-0.5 text-xs font-semibold text-zinc-500">
          <div><span className="text-zinc-400">Casual:</span> <span className="font-bold text-zinc-700 dark:text-zinc-350">{row.leaveBalances?.Casual ?? 12}</span></div>
          <div><span className="text-zinc-400">Sick:</span> <span className="font-bold text-zinc-700 dark:text-zinc-350">{row.leaveBalances?.Sick ?? 12}</span></div>
          <div><span className="text-zinc-400">Paid:</span> <span className="font-bold text-zinc-700 dark:text-zinc-350">{row.leaveBalances?.Paid ?? 12}</span></div>
        </div>
      ),
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(row)}
            className="!p-2 text-zinc-500 hover:text-zinc-900 border-zinc-200 dark:border-zinc-800 dark:hover:text-white"
          >
            <Edit2 className="w-4.5 h-4.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(row._id)}
            className="!p-2 text-rose-500 hover:text-rose-650 hover:bg-rose-500/10 border-zinc-200 dark:border-zinc-800"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Employee Directory
          </h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
            Super Admin dashboard for Employee profiles database and allocation
          </p>
        </div>
        <Button variant="primary" onClick={openAddModal} icon={Plus}>
          Add Employee
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          placeholder="Search by name, email, code..."
          value={search}
          onChange={handleSearchChange}
          className="w-full md:w-auto flex-1"
        />
        
        <div className="flex items-center gap-1 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-350'
            }`}
            title="List View"
          >
            <LayoutList className="w-4.5 h-4.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-350'
            }`}
            title="Grid View"
          >
            <Grid className="w-4.5 h-4.5" />
          </button>
        </div>
      </Card>

      {/* Employees Table / Grid view */}
      {viewMode === 'table' ? (
        <Table
          columns={columns}
          data={employees}
          loading={loading}
          emptyState={
            <div className="text-center py-12 text-zinc-500">
              No employees found matching standard search queries.
            </div>
          }
        />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"></div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/50">
          No employees found matching standard search queries.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <Card key={emp._id} hoverEffect className="relative flex flex-col justify-between p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={emp.name} src={emp.avatar} size="md" />
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white leading-tight">{emp.name}</h4>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">{emp.designation || 'Staff Member'}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-lg select-all">
                  {emp.employeeCode}
                </span>
              </div>
              
              <div className="mt-5 space-y-2 text-xs border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                {emp.phone && (
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <span>{emp.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  <span>{emp.department || 'Operations'}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2">Leave Balances</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-200/30">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase block">Casual</span>
                    <span className="font-black text-brand-600 dark:text-brand-400">{emp.leaveBalances?.Casual ?? 12}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-200/30">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase block">Sick</span>
                    <span className="font-black text-brand-600 dark:text-brand-400">{emp.leaveBalances?.Sick ?? 12}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-200/30">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase block">Paid</span>
                    <span className="font-black text-brand-600 dark:text-brand-400">{emp.leaveBalances?.Paid ?? 12}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(emp)}
                    className="!p-2 text-zinc-500 hover:text-zinc-900 border-zinc-200 dark:border-zinc-800 dark:hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(emp._id)}
                    className="!p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-zinc-200 dark:border-zinc-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        pages={pagination.pages}
        total={pagination.total}
        limit={8}
        onPageChange={(p) => setPage(p)}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditMode ? 'Edit Employee Details' : 'Create New Employee'}
        size="lg"
      >
        <form onSubmit={handleSaveEmployee} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              htmlFor="name"
              required
              error={validator.message('name', formData.name, 'required|min:2')}
            >
              <Input
                name="name"
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                icon={User}
              />
            </FormField>

            <FormField
              label="Email Address"
              htmlFor="email"
              required
              error={validator.message('email', formData.email, 'required|email')}
            >
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                icon={Mail}
              />
            </FormField>

            {!isEditMode && (
              <FormField
                label="Temp Password"
                htmlFor="password"
                required
                error={validator.message('password', formData.password, 'required|min:6')}
              >
                <PasswordInput
                  name="password"
                  id="password"
                  placeholder="Secret123"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </FormField>
            )}

            <FormField
              label="Employee Code"
              htmlFor="employeeCode"
              required
              error={validator.message('employeeCode', formData.employeeCode, 'required')}
            >
              <Input
                name="employeeCode"
                id="employeeCode"
                placeholder="EMP100"
                value={formData.employeeCode}
                onChange={handleInputChange}
                icon={Shield}
              />
            </FormField>

            <FormField
              label="Department"
              htmlFor="department"
            >
              <Select
                name="department"
                id="department"
                options={DEPARTMENTS}
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Select Department"
              />
            </FormField>

            <FormField
              label="Designation"
              htmlFor="designation"
            >
              <Input
                name="designation"
                id="designation"
                placeholder="Junior Engineer"
                value={formData.designation}
                onChange={handleInputChange}
                icon={Building2}
              />
            </FormField>

            <FormField
              label="Phone Number"
              htmlFor="phone"
            >
              <Input
                name="phone"
                id="phone"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleInputChange}
                icon={Phone}
              />
            </FormField>

            <div className="col-span-1 sm:col-span-2 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4 mt-2">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-4">Leave Balances Configuration</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <FormField label="Casual" htmlFor="casualBalance">
                  <Input type="number" name="casualBalance" id="casualBalance" value={formData.casualBalance} onChange={handleInputChange} />
                </FormField>
                <FormField label="Sick" htmlFor="sickBalance">
                  <Input type="number" name="sickBalance" id="sickBalance" value={formData.sickBalance} onChange={handleInputChange} />
                </FormField>
                <FormField label="Paid" htmlFor="paidBalance">
                  <Input type="number" name="paidBalance" id="paidBalance" value={formData.paidBalance} onChange={handleInputChange} />
                </FormField>
                <FormField label="Emergency" htmlFor="emergencyBalance">
                  <Input type="number" name="emergencyBalance" id="emergencyBalance" value={formData.emergencyBalance} onChange={handleInputChange} />
                </FormField>
                <FormField label="WFH" htmlFor="wfhBalance">
                  <Input type="number" name="wfhBalance" id="wfhBalance" value={formData.wfhBalance} onChange={handleInputChange} />
                </FormField>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={actionLoading}>
              {isEditMode ? 'Save Changes' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee Profile"
        description="Are you sure you want to delete this employee? This will permanently wipe their account, leave files, and notifications database."
        confirmText="Wipe Profile"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default Employees;
