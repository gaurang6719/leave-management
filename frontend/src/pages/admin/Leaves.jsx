import React, { useState, useEffect } from 'react';
import { Check, X, FileText, Filter, RotateCcw, CalendarDays } from 'lucide-react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import Textarea from '../../components/common/Textarea';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Select from '../../components/common/Select';
import { LEAVE_TYPE_OPTIONS, LEAVE_STATUS_OPTIONS } from '../../constants';
import { fetchAllLeavesList, approveRejectLeaveRequest } from '../../services/leave.service';
import toast from 'react-hot-toast';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  // Approval Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decision, setDecision] = useState('Approved'); // Approved or Rejected
  const [adminRemark, setAdminRemark] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const data = await fetchAllLeavesList({
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
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [page, search, status, leaveType]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setLeaveType('');
    setPage(1);
  };

  const openDecisionModal = (leave, action) => {
    setSelectedLeave(leave);
    setDecision(action);
    setAdminRemark('');
    setModalOpen(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    setActionLoading(true);
    try {
      const data = await approveRejectLeaveRequest(selectedLeave._id, {
        status: decision,
        adminRemark,
      });

      if (data.success) {
        toast.success(`Leave request successfully ${decision.toLowerCase()}`);
        setModalOpen(false);
        loadLeaves();
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Resolution action failed';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Employee Details',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.employee?.name} src={row.employee?.avatar} size="md" />
          <div>
            <p className="font-bold text-zinc-900 dark:text-white leading-tight">{row.employee?.name || 'Deleted Employee'}</p>
            <p className="text-[10px] text-zinc-400 font-mono mt-1 uppercase tracking-widest">{row.employee?.department || 'Operations'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Employee Code',
      render: (row) => <span className="font-mono text-xs font-bold text-zinc-600 dark:text-zinc-350">{row.employee?.employeeCode || 'N/A'}</span>,
    },
    {
      header: 'Leave Type & Reasons',
      render: (row) => (
        <div className="max-w-xs space-y-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">
            {row.leaveType}
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-1.5" title={row.reason}>
            {row.reason}
          </p>
        </div>
      ),
    },
    {
      header: 'Schedule Dates',
      render: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-zinc-800 dark:text-zinc-300">
            {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
            {row.days} day(s) duration
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <div className="space-y-1">
          <Badge>{row.status}</Badge>
          {row.adminRemark && (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic max-w-[120px] truncate" title={row.adminRemark}>
              Rem: {row.adminRemark}
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
          return <span className="text-xs text-zinc-400 font-medium">Resolved</span>;
        }

        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDecisionModal(row, 'Approved')}
              className="!p-1.5 text-emerald-605 border-zinc-200 dark:border-zinc-800 dark:hover:bg-emerald-500/10"
              title="Approve Leave"
            >
              <Check className="w-4.5 h-4.5 text-emerald-600" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDecisionModal(row, 'Rejected')}
              className="!p-1.5 text-rose-605 border-zinc-200 dark:border-zinc-800 dark:hover:bg-rose-500/10"
              title="Reject Leave"
            >
              <X className="w-4.5 h-4.5 text-rose-600" />
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
          Leave Applications
        </h2>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
          Approve or Reject pending employee leaves applications and remark comments
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-auto flex-1">
            <SearchBar
              placeholder="Search employee, reasons..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>
          <div className="grid grid-cols-2 md:flex items-center gap-3 w-full md:w-auto">
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
        </div>
      </Card>

      {/* Table list */}
      <Table
        columns={columns}
        data={leaves}
        loading={loading}
        emptyState={
          <div className="text-center py-12 text-zinc-500">
            No leave requests matched the criteria.
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

      {/* Approve/Reject Decision Dialog Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={decision === 'Approved' ? 'Approve Leave Application' : 'Reject Leave Application'}
        size="md"
      >
        <form onSubmit={handleDecisionSubmit} className="space-y-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800/60 rounded-xl">
            <div className="flex items-center gap-3">
              <Avatar name={selectedLeave?.employee?.name} src={selectedLeave?.employee?.avatar} size="sm" />
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">{selectedLeave?.employee?.name}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase mt-0.5">
                  Requested {selectedLeave?.days} day(s) of {selectedLeave?.leaveType}
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-3.5 pt-3.5 leading-relaxed italic">
              " {selectedLeave?.reason} "
            </p>
          </div>

          <FormField
            label="Admin remark comments (optional)"
            htmlFor="adminRemark"
          >
            <Textarea
              name="adminRemark"
              id="adminRemark"
              placeholder={decision === 'Approved' ? 'Looks good, work handover completed' : 'Insufficient reason details'}
              value={adminRemark}
              onChange={(e) => setAdminRemark(e.target.value)}
              rows={3}
            />
          </FormField>

          <div className="flex justify-end space-x-2 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={decision === 'Approved' ? 'primary' : 'danger'}
              loading={actionLoading}
            >
              Confirm {decision}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminLeaves;
