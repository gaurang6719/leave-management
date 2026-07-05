import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, ShieldCheck, ShieldAlert, BadgePlus, Sparkles, Send } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { fetchLeaveStats } from '../../services/leave.service';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const data = await fetchLeaveStats();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load employee stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardStats();
  }, []);

  if (loading) {
    return <Loader type="spinner" />;
  }

  const recentLeavesColumns = [
    {
      header: 'Leave Type',
      render: (row) => <span className="font-semibold text-zinc-900 dark:text-white">{row.leaveType}</span>,
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
      header: 'Duration',
      render: (row) => <span className="font-semibold text-brand-600 dark:text-brand-400">{row.days} day(s)</span>,
    },
    {
      header: 'Reason',
      render: (row) => <p className="max-w-xs truncate" title={row.reason}>{row.reason}</p>,
    },
    {
      header: 'Status',
      render: (row) => <Badge>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Employee Dashboard
          </h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
            Overview of your leave balances and recent logs
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/employee/apply')}
          icon={BadgePlus}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Top Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Approved Days"
          value={stats?.totalDaysTaken || 0}
          icon={ShieldCheck}
          color="emerald"
          trendText="total approved days"
        />
        <StatsCard
          title="Pending Requests"
          value={stats?.pendingLeaves || 0}
          icon={Send}
          color="amber"
          trendText="requests awaiting review"
        />
        <StatsCard
          title="Rejected Requests"
          value={stats?.rejectedLeaves || 0}
          icon={ShieldAlert}
          color="rose"
          trendText="disapproved requests"
        />
      </div>

      {/* Balances and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Balances Breakdown */}
        <Card className="lg:col-span-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-5 text-brand-600 dark:text-brand-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Your Leave Balances</h3>
            </div>
            <div className="space-y-4 text-xs">
              {[
                { name: 'Casual Leaves', val: stats?.leaveBalances?.Casual ?? 12, max: 12, color: 'bg-brand-500' },
                { name: 'Sick Leaves', val: stats?.leaveBalances?.Sick ?? 12, max: 12, color: 'bg-emerald-500' },
                { name: 'Paid Leaves', val: stats?.leaveBalances?.Paid ?? 12, max: 12, color: 'bg-violet-500' },
                { name: 'Emergency Leaves', val: stats?.leaveBalances?.Emergency ?? 12, max: 12, color: 'bg-amber-500' },
                { name: 'Work From Home (WFH)', val: stats?.leaveBalances?.WFH ?? 12, max: 12, color: 'bg-pink-500' },
              ].map((item, idx) => {
                const percentage = Math.min(100, Math.round((item.val / item.max) * 100));
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-zinc-650 dark:text-zinc-350">{item.name}</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100">{item.val} / {item.max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Right Card: Monthly Leaves Chart */}
        <div className="lg:col-span-2">
          {(() => {
            const MONTHS_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentYear = new Date().getFullYear();
            const monthlyData = MONTHS_NAMES.map((name, index) => {
              const monthNum = index + 1;
              const match = (stats?.monthlyStats || []).find(
                (item) => item._id.year === currentYear && item._id.month === monthNum
              );
              return {
                month: name,
                days: match ? match.totalDays : 0,
                count: match ? match.count : 0,
              };
            });

            const maxDaysVal = Math.max(...monthlyData.map(d => d.days), 5);

            return (
              <Card className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-5 text-brand-600 dark:text-brand-400">
                    <CalendarClock className="w-4 h-4 text-brand-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                      Monthly Leave History ({currentYear})
                    </h3>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3.5 pt-6 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-2">
                    {monthlyData.map((data, idx) => {
                      const percentHeight = Math.min(100, Math.round((data.days / maxDaysVal) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          {/* Tooltip on Hover */}
                          <div className={`absolute top-2 ${idx === 0 ? 'left-0' : idx === monthlyData.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'} bg-zinc-950 text-white dark:bg-zinc-800 text-[10px] font-bold py-1.5 px-2.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-25 border border-zinc-800 dark:border-zinc-700`}>
                            {data.days} days ({data.count} leaves)
                          </div>

                          {/* Bar */}
                          <div className="w-full bg-zinc-100 dark:bg-zinc-900/40 rounded-t-lg overflow-hidden flex items-end h-full">
                            <div
                              className="w-full bg-gradient-to-t from-brand-600 to-indigo-600 dark:from-brand-500/80 dark:to-indigo-500/80 rounded-t-lg group-hover:from-brand-500 group-hover:to-indigo-450 transition-all duration-300 relative"
                              style={{ height: `${percentHeight}%` }}
                            >
                              {data.days > 0 && (
                                <span className="absolute top-1 left-0 right-0 text-center text-[9px] font-bold text-white">
                                  {data.days}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Label */}
                          <span className="text-[10px] text-zinc-400 font-bold mt-2">
                            {data.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right Area: Recent Leaves */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Recent Application Logs
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/employee/history')}
            >
              View Full History
            </Button>
          </div>
          <Table
            columns={recentLeavesColumns}
            data={stats?.recentLeaves || []}
            emptyState={
              <EmptyState
                title="No leave requests filed yet"
                description="Apply for leaves using the portal dashboard tools."
                action={
                  <Button variant="primary" onClick={() => navigate('/employee/apply')}>
                    Apply Now
                  </Button>
                }
              />
            }
          />
        </div>

        {/* Left Area: Informational Guideline Card */}
        <Card className="lg:col-span-1 p-6 flex flex-col justify-between h-fit bg-gradient-to-tr from-brand-600/5 to-indigo-650/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-350">
                Leave Policy Guidelines
              </h3>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-3 leading-relaxed">
              <p>
                1. <strong>Deduction:</strong> Approved leave requests will deduct days from your remaining balance automatically.
              </p>
              <p>
                2. <strong>Pending:</strong> You can edit or cancel leave requests while they remain in <em>Pending</em> status.
              </p>
              <p>
                3. <strong>Locked:</strong> Once approved, rejected, or cancelled, a request cannot be edited or modified.
              </p>
              <p>
                4. <strong>Support:</strong> Work From Home requests do not deduct days from your leave balance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
