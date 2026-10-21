import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Organization } from '../../types';
import {
  ShieldAlert,
  Building,
  Users,
  Briefcase,
  Ticket,
  Activity,
  Server,
  Database,
  Mail,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  ExternalLink,
  Sliders,
  X
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const {
    organizations,
    allUsers,
    jobs,
    applications,
    supportTickets,
    addAuditLog
  } = useApp();

  const [orgsList, setOrgsList] = useState<Organization[]>(organizations);
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDomain, setNewOrgDomain] = useState('');
  const [newOrgTier, setNewOrgTier] = useState<Organization['tier']>('ENTERPRISE');

  const openTicketsCount = supportTickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
  const totalHiresCount = applications.filter(a => a.stage === 'HIRED').length;

  const handleToggleOrgStatus = (orgId: string) => {
    setOrgsList(prev =>
      prev.map(o => {
        if (o.id !== orgId) return o;
        const nextStatus = o.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        addAuditLog('TENANT_STATUS_CHANGE', `Tenant #${o.slug}`, `Status changed to ${nextStatus}`);
        return { ...o, status: nextStatus };
      })
    );
  };

  const handleAddOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: newOrgName.trim(),
      slug: newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      tier: newOrgTier,
      status: 'ACTIVE',
      domain: newOrgDomain.trim() || `${newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      activeJobsCount: 0,
      totalHiresCount: 0,
      departments: ['Engineering', 'Product', 'Operations'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setOrgsList([newOrg, ...orgsList]);
    addAuditLog('TENANT_CREATED', `Tenant #${newOrg.slug}`, `Provisioned new tenant organization on ${newOrgTier} tier`);
    setShowAddOrgModal(false);
    setNewOrgName('');
    setNewOrgDomain('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Super Admin Command</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
              Root Level
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global multi-tenant governance, organization subscriptions, cross-tenant auditing, and infrastructure status.
          </p>
        </div>

        <button
          onClick={() => setShowAddOrgModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Tenant Organization</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Tenants</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{orgsList.length}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">100% healthy isolation</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">User Accounts</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{allUsers.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across all 7 roles</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Requisitions</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{jobs.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Published ATS positions</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Placements Hired</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{totalHiresCount}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Offers finalized</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform Tickets</span>
            <div className="text-2xl font-black text-rose-600 font-mono mt-1">{openTicketsCount}</div>
            <div className="text-[10px] text-rose-700 font-semibold mt-0.5">Open support queues</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700">
            <Ticket className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* System Integration Health Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">Infrastructure Services & Microservices Health</h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>99.98% System Uptime</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">PostgreSQL Primary</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
            <div className="text-[11px] text-slate-500">v16.2 • 2ms Latency • Connection Pool: 42/100</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">S3 Document Store</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
            <div className="text-[11px] text-slate-500">14.8 GB Resumes & Attachments Encrypted (AES-256)</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Redis Background Worker</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
            <div className="text-[11px] text-slate-500">SLA Timers & Email Dispatch Queue: 0 Pending</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">SMTP Transactional Mail</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>
            <div className="text-[11px] text-slate-500">Verified TLS Gateway • 100% Deliverability</div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Registered SaaS Organizations (Tenants)</h3>
            <p className="text-xs text-slate-500">Full tenant isolation with independent databases and security contexts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Organization Name</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Subscription Tier</th>
                <th className="py-3 px-4">Active Jobs</th>
                <th className="py-3 px-4">Total Hires</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgsList.map(org => (
                <tr key={org.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{org.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{org.domain}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                      {org.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{org.activeJobsCount}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{org.totalHiresCount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        org.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}
                    >
                      {org.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleOrgStatus(org.id)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                        org.status === 'ACTIVE'
                          ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                          : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {org.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROVISION TENANT MODAL */}
      {showAddOrgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Provision Tenant Organization</h3>
              <button onClick={() => setShowAddOrgModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrgSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Organization Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={e => setNewOrgName(e.target.value)}
                  placeholder="e.g. Apex Cybernetics LLC"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Company Domain</label>
                <input
                  type="text"
                  value={newOrgDomain}
                  onChange={e => setNewOrgDomain(e.target.value)}
                  placeholder="e.g. apexcyber.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subscription Tier</label>
                <select
                  value={newOrgTier}
                  onChange={e => setNewOrgTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none"
                >
                  <option value="ENTERPRISE">ENTERPRISE (Unlimited Seats & Custom Integrations)</option>
                  <option value="GROWTH">GROWTH (Up to 25 Recruiters)</option>
                  <option value="STARTER">STARTER (Up to 5 Recruiters)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddOrgModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Deploy Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
