import React, { useState, useEffect } from 'react';
import { Edit2, Ban, Filter, RotateCcw, CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import useValidator from '../../hooks/useValidator';
import { LEAVE_TYPE_OPTIONS, LEAVE_STATUS_OPTIONS } from '../../constants';
import {
  fetchMyLeavesList,
  updatePendingLeaveRequest,
  cancelPendingLeaveRequest,
} from '../../services/leave.service';
import toast from 'react-hot-toast';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  // Modal editing states
  const [editOpen, setEditOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editData, setEditData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    days: '',
    reason: '',
  });

  // Cancel dialog states
  const [cancelOpen, setCancelOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { validator, validateAll, validateField, resetValidation } = useValidator();

  const loadMyLeaves = async () => {
    setLoading(true);
    try {
      const data = await fetchMyLeavesList({
        search,
        status,
        leaveType,
        page,
        limit: 8,
      });
      if (data.success) {
        setLeaves(data.leaves);
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error('Failed to load leave history logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyLeaves();
  }, [page, search, status, leaveType]);

  // Recalculate days inside edit modal
  useEffect(() => {
    if (editData.startDate && editData.endDate) {
      const start = dayjs(editData.startDate);
      const end = dayjs(editData.endDate);
      if (end.isAfter(start) || end.isSame(start)) {
        const diff = end.diff(start, 'day') + 1;
        setEditData((prev) => ({ ...prev, days: diff.toString() }));
      } else {
        setEditData((prev) => ({ ...prev, days: '' }));
      }
    }
  }, [editData.startDate, editData.endDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setLeaveType('');
    setPage(1);
  };

  const openEditModal = (leave) => {
    setSelectedLeave(leave);
    setEditData({
      leaveType: leave.leaveType || '',
      startDate: dayjs(leave.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(leave.endDate).format('YYYY-MM-DD'),
      days: leave.days?.toString() || '',
      reason: leave.reason || '',
    });
    resetValidation();
    setEditOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    if (!validateAll()) {
      return;
    }

    const numDays = parseFloat(editData.days);
    if (isNaN(numDays) || numDays <= 0) {
      toast.error('Days count must be greater than 0');
      return;
    }

    setActionLoading(true);
    try {
      const data = await updatePendingLeaveRequest(selectedLeave._id, {
        leaveType: editData.leaveType,
        startDate: editData.startDate,
        endDate: editData.endDate,
        days: numDays,
        reason: editData.reason,
      });

      if (data.success) {
        toast.success('Leave request updated successfully');
        setEditOpen(false);
        loadMyLeaves();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update leave';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const openCancelDialog = (leave) => {
    setSelectedLeave(leave);
    setCancelOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedLeave) return;

    setActionLoading(true);
    try {
      const data = await cancelPendingLeaveRequest(selectedLeave._id);
      if (data.success) {
        toast.success('Leave request cancelled successfully');
        setCancelOpen(false);
        loadMyLeaves();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to cancel leave';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Leave Type',
      render: (row) => <span className="font-semibold text-zinc-950 dark:text-white">{row.leaveType}</span>,
    },
    {
      header: 'Start Date',
      render: (row) => <span>{new Date(row.startDate).toLocaleDateString()}</span>,
    },
    {
      header: 'End Date',
      render: (row) => <span>{new Date(row.endDate).toLocaleDateString()}</span>,
    },
    {
      header: 'Days duration',
      render: (row) => <span className="font-bold text-brand-600 dark:text-brand-400">{row.days} day(s)</span>,
    },
    {
      header: 'Reason',
      render: (row) => (
        <p className="max-w-xs truncate" title={row.reason}>
          {row.reason}
        </p>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <div className="space-y-1">
          <Badge>{row.status}</Badge>
          {row.adminRemark && (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic max-w-[120px] truncate" title={row.adminRemark}>
              Remark: {row.adminRemark}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (row) => {
        if (row.status !== 'Pending') {
          return <span className="text-xs text-zinc-400 font-medium select-none">Locked</span>;
        }

        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditModal(row)}
              className="!p-2 text-zinc-500 hover:text-zinc-950 border-zinc-200 dark:border-zinc-800 dark:hover:text-white"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openCancelDialog(row)}
              className="!p-2 text-rose-500 hover:text-rose-650 hover:bg-rose-500/10 border-zinc-200 dark:border-zinc-800"
            >
              <Ban className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Leave History
        </h2>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor your leave requests history and pending submissions
        </p>
      </div>

      {/* Filter and Search Card */}
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-auto flex-1">
          <SearchBar
            placeholder="Search reasons..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>
        <div className="grid grid-cols-2 md:flex items-center gap-3 w-full md:w-auto animate-fade-in">
          <div className="flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1">
            <Filter className="w-4 h-4 text-zinc-400" />
            <Select
              name="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              options={LEAVE_STATUS_OPTIONS}
              placeholder="All Statuses"
              borderless
              className="!border-none !bg-transparent !p-0 focus:!ring-0 focus:!border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1">
            <CalendarDays className="w-4 h-4 text-zinc-400" />
            <Select
              name="leaveType"
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value);
                setPage(1);
              }}
              options={LEAVE_TYPE_OPTIONS}
              placeholder="All Types"
              borderless
              className="!border-none !bg-transparent !p-0 focus:!ring-0 focus:!border-transparent"
            />
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={handleResetFilters}
            className="col-span-2 md:col-span-1 justify-center shrink-0"
            icon={RotateCcw}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* History table */}
      <Table
        columns={columns}
        data={leaves}
        loading={loading}
        emptyState={
          <div className="text-center py-12 text-zinc-500">
            No leave records matched filters.
          </div>
        }
      />

      {/* Pagination */}
      <Pagination
        page={page}
        pages={pagination.pages}
        total={pagination.total}
        limit={8}
        onPageChange={(p) => setPage(p)}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Pending Leave Request"
        size="md"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <FormField
            label="Leave Type"
            htmlFor="editLeaveType"
            required
            error={validator.message('leaveType', editData.leaveType, 'required')}
          >
            <Select
              name="leaveType"
              id="editLeaveType"
              options={LEAVE_TYPE_OPTIONS}
              value={editData.leaveType}
              onChange={handleInputChange}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              htmlFor="editStartDate"
              required
              error={validator.message('startDate', editData.startDate, 'required')}
            >
              <Input
                type="date"
                name="startDate"
                id="editStartDate"
                value={editData.startDate}
                onChange={handleInputChange}
                min={dayjs().format('YYYY-MM-DD')}
              />
            </FormField>

            <FormField
              label="End Date"
              htmlFor="editEndDate"
              required
              error={validator.message('endDate', editData.endDate, 'required')}
            >
              <Input
                type="date"
                name="endDate"
                id="editEndDate"
                value={editData.endDate}
                onChange={handleInputChange}
                min={editData.startDate || dayjs().format('YYYY-MM-DD')}
              />
            </FormField>
          </div>

          <FormField
            label="Calculated Days"
            htmlFor="editDays"
            required
            error={validator.message('days', editData.days, 'required')}
          >
            <Input
              type="number"
              name="days"
              id="editDays"
              value={editData.days}
              onChange={handleInputChange}
              disabled
            />
          </FormField>

          <FormField
            label="Reason"
            htmlFor="editReason"
            required
            error={validator.message('reason', editData.reason, 'required|min:5|max:500')}
          >
            <Textarea
              name="reason"
              id="editReason"
              value={editData.reason}
              onChange={handleInputChange}
              rows={3}
            />
          </FormField>

          <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={actionLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Leave Application"
        description="Are you sure you want to cancel this pending leave request? This action will mark your application as Cancelled."
        confirmText="Cancel Request"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default LeaveHistory;
