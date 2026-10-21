import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Search, Filter, Clock, Download, UserCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    const q = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q)
    );
  });

  const exportAuditCSV = () => {
    let csv = 'Timestamp,User,Role,Action,Entity,Details,IP Address\n';
    filteredLogs.forEach(l => {
      csv += `"${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.entity}","${l.details.replace(/"/g, '""')}","${l.ipAddress}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hireflow_audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security & Governance Audit Trail</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
              SOC-2 Type II
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable transactional log recording all authentication events, role escalations, stage transitions, and data operations.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search action, actor, entity details..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
          >
            <option value="ALL">All Actions ({auditLogs.length})</option>
            <option value="STAGE_TRANSITION">STAGE TRANSITIONS</option>
            <option value="OFFER_SENT">OFFERS EXTENDED</option>
            <option value="OFFER_RESPONSE">OFFER RESPONSES</option>
            <option value="TICKET_CREATED">TICKETS DISPATCHED</option>
            <option value="TICKET_REPLY">TICKET REPLIES</option>
            <option value="TENANT_CREATED">TENANT PROVISIONING</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{log.entity}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">{log.details}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
