import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  CheckCircle2,
  Users,
  Briefcase
} from 'lucide-react';

export const ReportsAnalyticsPage: React.FC = () => {
  const { activeOrg, applications, jobs, supportTickets } = useApp();

  const [dateRange, setDateRange] = useState('2026-Q3');

  // Recruitment Funnel Data
  const funnelData = [
    { stage: 'Applied', count: applications.length + 45 },
    { stage: 'Screened', count: applications.filter(a => a.stage !== 'APPLIED').length + 32 },
    { stage: 'Shortlisted', count: applications.filter(a => !['APPLIED', 'SCREENING'].includes(a.stage)).length + 20 },
    { stage: 'Interviewed', count: applications.filter(a => ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'OFFER_SENT', 'HIRED'].includes(a.stage)).length + 12 },
    { stage: 'Offered', count: applications.filter(a => ['OFFER_SENT', 'OFFER_ACCEPTED', 'HIRED'].includes(a.stage)).length + 8 },
    { stage: 'Hired', count: applications.filter(a => a.stage === 'HIRED').length + 6 }
  ];

  // Department Breakdown Data
  const deptData = [
    { name: 'Engineering', value: 42, color: '#10b981' },
    { name: 'Product & Design', value: 24, color: '#6366f1' },
    { name: 'Sales & RevOps', value: 18, color: '#f59e0b' },
    { name: 'Marketing', value: 10, color: '#ec4899' },
    { name: 'Customer Success', value: 6, color: '#06b6d4' }
  ];

  // Time-to-hire Trends Data
  const trendData = [
    { month: 'May 2026', avgDays: 24, hires: 12 },
    { month: 'Jun 2026', avgDays: 22, hires: 15 },
    { month: 'Jul 2026', avgDays: 19, hires: 18 },
    { month: 'Aug 2026', avgDays: 21, hires: 16 },
    { month: 'Sep 2026', avgDays: 18, hires: 22 },
    { month: 'Oct 2026', avgDays: 16, hires: 25 }
  ];

  // Support Inflow vs Resolution
  const supportData = [
    { week: 'Wk 38', received: 14, resolved: 14 },
    { week: 'Wk 39', received: 18, resolved: 17 },
    { week: 'Wk 40', received: 22, resolved: 21 },
    { week: 'Wk 41', received: 16, resolved: 16 },
    { week: 'Wk 42', received: 25, resolved: 23 }
  ];

  const handleExportCSV = () => {
    let csv = 'Stage,Count\n';
    funnelData.forEach(f => {
      csv += `${f.stage},${f.count}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hireflow_recruitment_funnel_${dateRange}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recruitment Pipeline Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Real-time BI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Conversion velocity, funnel drop-off diagnostics, time-to-hire benchmarks, and support SLA performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Funnel Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recruitment Conversion Funnel</h3>
              <p className="text-xs text-slate-500">Applicant drop-off from initial submission to final hire.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              14.2% Overall Conversion
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Pie */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Hiring by Department</h3>
              <p className="text-xs text-slate-500">Distribution of open requisitions across functional teams.</p>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time-to-Hire Velocity Trend Line */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Time-to-Hire Velocity (Days)</h3>
              <p className="text-xs text-slate-500">Days from requisition posting to offer signed.</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              -33% Faster Since May
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="avgDays" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Support Inflow vs Resolution Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Support Ticket SLA Resolution Pace</h3>
              <p className="text-xs text-slate-500">Grievances dispatched vs closed within SLA window.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              96.2% Resolved on Time
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="received" fill="#f59e0b" name="Received" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
