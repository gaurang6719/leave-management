import React, { useState, useEffect } from 'react';
import { Users, CalendarClock, ShieldCheck, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { fetchLeaveStats } from '../../services/leave.service';

const AdminDashboard = () => {
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
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardStats();
  }, []);

  if (loading) {
    return <Loader type="spinner" />;
  }

  // Format type stats for rendering
  const typeStats = stats?.typeStats || [];

  const recentLeavesColumns = [
    {
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.employee?.name} src={row.employee?.avatar} size="sm" />
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">{row.employee?.name || 'Deleted Employee'}</p>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{row.employee?.employeeCode || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Leave Type',
      render: (row) => <span className="font-semibold">{row.leaveType}</span>,
    },
    {
      header: 'Duration',
      render: (row) => (
        <div>
          <p className="font-medium">{new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{row.days} day(s)</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <Badge>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Admin Overview
          </h2>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time leave monitoring and system metrics
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-350">
          <TrendingUp className="w-4 h-4 text-brand-500" />
          Active Session
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={stats?.totalEmployees || 0}
          icon={Users}
          color="brand"
          trend={{ type: 'up', value: '4%' }}
          trendText="from last month"
        />
        <StatsCard
          title="Pending Requests"
          value={stats?.pendingLeaves || 0}
          icon={CalendarClock}
          color="amber"
          trendText="awaiting resolution"
          trend={stats?.pendingLeaves > 0 ? { type: 'up', value: stats.pendingLeaves } : null}
        />
        <StatsCard
          title="Approved Requests"
          value={stats?.approvedLeaves || 0}
          icon={ShieldCheck}
          color="emerald"
          trendText="approved and deducted"
        />
        <StatsCard
          title="Rejected Requests"
          value={stats?.rejectedLeaves || 0}
          icon={ShieldAlert}
          color="rose"
          trendText="rejected leave instances"
        />
      </div>

      {/* Employee Leaves Analytics Chart */}
      {(() => {
        const chartData = (stats?.employeeLeaveStats || []).map((item) => ({
          employeeName: item.employeeName,
          employeeCode: item.employeeCode,
          days: item.totalDays,
          typesBreakdown: item.types || [],
        }));

        const maxDaysVal = Math.max(...chartData.map(d => d.days), 5);

        return (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <CalendarClock className="w-5 h-5 text-brand-500" />
                  Employee Leaves Analytics
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Approved leave allocations and details comparison by staff profile</p>
              </div>
            </div>

            {chartData.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 bg-zinc-50/50 dark:bg-zinc-950/20 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl">
                <CalendarClock className="w-8 h-8 text-zinc-400 dark:text-zinc-650 mb-2 animate-pulse" />
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-350">No leave data available</p>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">No employee leave requests have been approved yet.</p>
              </div>
            ) : (
              <div className="h-48 flex items-end justify-start gap-5 pt-6 border-b border-zinc-200/40 dark:border-zinc-800/40 pb-2 overflow-x-auto scrollbar-thin">
                {chartData.map((data, idx) => {
                  const percentHeight = Math.min(100, Math.round((data.days / maxDaysVal) * 100));
                  return (
                    <div key={idx} className="w-16 flex-none flex flex-col items-center group relative h-full justify-end">
                      {/* Tooltip on Hover */}
                      <div className={`absolute top-2 ${idx === 0 ? 'left-0' : idx === chartData.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'} bg-zinc-950 text-white dark:bg-zinc-900 text-[10px] font-semibold py-2 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-25 border border-zinc-850 dark:border-zinc-800 min-w-[140px] text-left`}>
                        <p className="font-bold border-b border-zinc-900 dark:border-zinc-800 pb-1 mb-1">{data.employeeName}</p>
                        <p className="text-zinc-400 font-mono text-[9px] mb-1">Code: {data.employeeCode}</p>
                        <p className="text-brand-400 dark:text-brand-350 font-bold mb-1.5">Total: {data.days} Days</p>
                        <div className="space-y-0.5 text-[9px] text-zinc-450 border-t border-zinc-900 dark:border-zinc-800 pt-1">
                          {data.typesBreakdown.map((t, tIdx) => (
                            <div key={tIdx} className="flex justify-between">
                              <span>{t.leaveType}</span>
                              <span className="font-bold text-zinc-300">{t.days} d</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-zinc-100 dark:bg-zinc-900/40 rounded-t-lg overflow-hidden flex items-end h-full">
                        <div
                          className="w-full bg-gradient-to-t from-brand-600 to-indigo-600 dark:from-brand-500/80 dark:to-indigo-500/80 rounded-t-lg group-hover:from-brand-500 group-hover:to-indigo-400 transition-all duration-300 relative"
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
                      <span className="text-[10px] text-zinc-450 font-bold mt-2 truncate w-full text-center px-0.5" title={data.employeeName}>
                        {data.employeeName}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Placeholder / Leave distribution visual */}
        <Card className="lg:col-span-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Leave Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {typeStats.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  No leave distribution metrics
                </div>
              ) : (
                typeStats.map((type) => {
                  const percentage = Math.min(100, Math.round((type.totalDays / 20) * 100)); // relative to typical balance
                  return (
                    <div key={type._id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-700 dark:text-zinc-300">{type._id}</span>
                        <span className="text-zinc-500">{type.totalDays} Days ({type.count} reqs)</span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-indigo-650 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-tr from-brand-500/5 to-indigo-500/5 border border-brand-500/10 rounded-2xl mt-6">
            <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400">Quick Insight</h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              Approved leaves represent days deducted from the standard user allocation pool. Set up rules for custom automatic balance resets.
            </p>
          </div>
        </Card>

        {/* Recent Leaves Activities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Recent Activity Logs
            </h3>
          </div>
          <Table
            columns={recentLeavesColumns}
            data={stats?.recentLeaves || []}
            emptyState={
              <EmptyState
                title="No recent requests"
                description="No employee has submitted a leave application yet."
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
