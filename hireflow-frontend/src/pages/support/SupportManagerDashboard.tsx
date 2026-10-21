import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketQueue, TicketPriority } from '../../types';
import {
  Sliders,
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

export const SupportManagerDashboard: React.FC = () => {
  const {
    supportTickets,
    allUsers,
    assignTicket,
    updateTicketStatus,
    escalateTicket
  } = useApp();

  const [selectedTicketForReassign, setSelectedTicketForReassign] = useState<SupportTicket | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState('u-support-agent');
  const [reassignReason, setReassignReason] = useState('Workload balancing & specialized queue routing');

  const supportStaff = allUsers.filter(u => u.role === 'SUPPORT_AGENT' || u.role === 'SUPPORT_MANAGER');

  const openTickets = supportTickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  const escalatedTickets = supportTickets.filter(t => t.status === 'ESCALATED' || t.priority === 'CRITICAL');
  const resolvedTickets = supportTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketForReassign) return;
    const agent = supportStaff.find(s => s.id === selectedAgentId);
    if (!agent) return;

    assignTicket(selectedTicketForReassign.id, agent.id, agent.name);
    setSelectedTicketForReassign(null);
  };

  const routingRules = [
    { category: 'CANDIDATE_APPLICATION', queue: 'CANDIDATE_SUPPORT', sla: '8 Hours', manager: 'Jordan Miller' },
    { category: 'RECRUITER_JOB_POSTING', queue: 'RECRUITMENT_SUPPORT', sla: '4 Hours', manager: 'Victoria Stirling' },
    { category: 'INTERVIEW_SCHEDULING', queue: 'RECRUITMENT_OPS_SUPPORT', sla: '4 Hours', manager: 'Jordan Miller' },
    { category: 'AGENCY_SUBMISSION', queue: 'AGENCY_SUPPORT', sla: '4 Hours', manager: 'Victoria Stirling' },
    { category: 'ORG_PERMISSIONS / BILLING', queue: 'ORG_SUPPORT', sla: '8 Hours', manager: 'Alexander Vance' },
    { category: 'PLATFORM_SYSTEM', queue: 'PLATFORM_SUPPORT', sla: '2 Hours (Critical)', manager: 'Platform SRE Lead' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Support Operations Command</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              SLA Oversight
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global queue governance, agent workload distribution, SLA breach monitoring, and ticket triage routing.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{supportTickets.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across all 7 dispatches</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Backlog</span>
            <div className="text-2xl font-black text-amber-600 font-mono mt-1">{openTickets.length}</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Active investigation</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Escalations</span>
            <div className="text-2xl font-black text-rose-600 font-mono mt-1">{escalatedTickets.length}</div>
            <div className="text-[10px] text-rose-700 font-semibold mt-0.5">Priority 2h SLA target</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SLA Compliance</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">94.8%</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Within target windows</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SLA Policies & Routing Rules Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Configured Automatic Routing Rules</h3>
            <p className="text-xs text-slate-500">Incoming tickets are mapped automatically to dedicated queues.</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            6 Rules Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Trigger Category</th>
                <th className="py-2.5 px-3">Target Queue</th>
                <th className="py-2.5 px-3">Target SLA</th>
                <th className="py-2.5 px-3">Lead Support Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {routingRules.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.category}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                      {r.queue}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{r.sla}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Tickets Table with Reassignment Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Global Ticket Queues & Agent Workload</h3>
            <p className="text-xs text-slate-500">Reassign tickets across team members or force state transitions.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Queue</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supportTickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.ticketNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 line-clamp-1">{t.subject}</div>
                    <div className="text-[10px] text-slate-400">{t.userName} ({t.userRole})</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] text-slate-600 font-semibold">{t.queue}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : t.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {t.assignedAgentName || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedTicketForReassign(t)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-[11px] cursor-pointer"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REASSIGN MODAL */}
      {selectedTicketForReassign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Reassign Ticket {selectedTicketForReassign.ticketNumber}
              </h3>
              <button onClick={() => setSelectedTicketForReassign(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReassignSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Target Agent *</label>
                <select
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none"
                >
                  {supportStaff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Reassignment Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedTicketForReassign(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
