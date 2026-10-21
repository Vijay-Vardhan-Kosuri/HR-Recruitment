import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  Building,
  Users,
  Briefcase,
  Gift,
  Plus,
  Mail,
  UserCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  X
} from 'lucide-react';

export const OrgAdminDashboard: React.FC = () => {
  const {
    activeOrg,
    allUsers,
    jobs,
    applications,
    offers,
    addAuditLog
  } = useApp();

  const [teamMembers, setTeamMembers] = useState<User[]>(() =>
    allUsers.filter(u => u.organizationId === activeOrg.id)
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDept, setInviteDept] = useState('Engineering');
  const [inviteRole, setInviteRole] = useState<'RECRUITER' | 'ORG_ADMIN'>('RECRUITER');

  const orgJobs = jobs.filter(j => j.organizationId === activeOrg.id);
  const orgApps = applications.filter(a => a.organizationId === activeOrg.id);
  const orgHires = orgApps.filter(a => a.stage === 'HIRED').length;
  const orgOffers = offers.filter(o => o.organizationId === activeOrg.id);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: User = {
      id: `u-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      organizationId: activeOrg.id,
      organizationName: activeOrg.name,
      status: 'ACTIVE',
      department: inviteDept,
      title: inviteRole === 'ORG_ADMIN' ? 'Talent Acquisition Partner' : 'Technical Recruiter',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTeamMembers([newMember, ...teamMembers]);
    addAuditLog('MEMBER_INVITED', `User #${newMember.email}`, `Invited ${newMember.name} as ${newMember.role} in ${newMember.department}`);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeOrg.name} Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
              Tenant Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Recruitment team governance, departmental requisitions, time-to-hire velocity, and hiring approvals.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Requisitions</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{orgJobs.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Across {activeOrg.departments.length} departments</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidates In Funnel</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{orgApps.length}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Active evaluation pipeline</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Offers Issued</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{orgOffers.length}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">91% acceptance rate</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Time to Hire</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">18 Days</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Industry avg: 36 days</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Hiring Team Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Hiring Team Members & Permissions</h3>
            <p className="text-xs text-slate-500">Recruiters, sourcers, and hiring managers with authorized tenant access.</p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            {teamMembers.length} Members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{m.email}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{m.department || 'Talent Acquisition'}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE MEMBER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="e.g. rachel.adams@acmecorp.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                  <select
                    value={inviteDept}
                    onChange={e => setInviteDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & RevOps">Sales & RevOps</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Talent & HR">Talent & HR</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">System Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none"
                  >
                    <option value="RECRUITER">RECRUITER</option>
                    <option value="ORG_ADMIN">ORG ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
