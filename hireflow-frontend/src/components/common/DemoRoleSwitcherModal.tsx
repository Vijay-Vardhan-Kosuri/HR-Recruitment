import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  ShieldAlert,
  Building,
  UserCheck,
  Send,
  User,
  Headphones,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface RoleOption {
  role: UserRole;
  title: string;
  name: string;
  email: string;
  pass: string;
  org: string;
  desc: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
}

export const DemoRoleSwitcherModal: React.FC = () => {
  const { isRoleSwitcherOpen, closeRoleSwitcher, currentUser, switchUserRole } = useApp();

  if (!isRoleSwitcherOpen) return null;

  const rolesList: RoleOption[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Super Admin',
      name: 'Alexander Vance',
      email: 'superadmin@hireflow.io',
      pass: 'Admin@123',
      org: 'HireFlow Platform Global',
      desc: 'Global multi-tenant platform metrics, manage organizations, tier subscriptions, cross-tenant auditing, and system health.',
      icon: ShieldAlert,
      badge: 'Platform Root',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
    },
    {
      role: 'ORG_ADMIN',
      title: 'Organization Admin',
      name: 'Sarah Jenkins',
      email: 'sarah.admin@acmecorp.com',
      pass: 'Admin@123',
      org: 'Acme Technologies Inc.',
      desc: 'Tenant administration: manage hiring teams, department structures, job approvals, executive compensation budgets, and recruitment reports.',
      icon: Building,
      badge: 'Company Lead',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
    },
    {
      role: 'RECRUITER',
      title: 'Recruiter',
      name: 'Marcus Holloway',
      email: 'marcus.recruiter@acmecorp.com',
      pass: 'Recruiter@123',
      org: 'Acme Technologies Inc.',
      desc: 'Interactive candidate Kanban pipeline, job requisitions, candidate resume screening, scheduling interviews, and issuing offer letters.',
      icon: UserCheck,
      badge: 'Talent Lead',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    },
    {
      role: 'STAFFING_AGENCY',
      title: 'Staffing Agency',
      name: 'Elena Rostova',
      email: 'elena.agency@globalstaff.com',
      pass: 'Agency@123',
      org: 'GlobalStaff Partners Agency',
      desc: 'External agency portal: client company management, requisition mandates, candidate submissions, and placement commission fees.',
      icon: Send,
      badge: 'Agency Partner',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
    },
    {
      role: 'CANDIDATE',
      title: 'Candidate',
      name: 'Alex Chen',
      email: 'alex.dev@gmail.com',
      pass: 'Candidate@123',
      org: 'Individual Job Seeker',
      desc: 'Candidate career hub: browse published jobs, 1-click apply, track application stage timeline, confirm interview invites, and sign offer letters.',
      icon: User,
      badge: 'Job Seeker',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
    },
    {
      role: 'SUPPORT_AGENT',
      title: 'Customer Support Agent',
      name: 'Jordan Miller',
      email: 'jordan.support@hireflow.io',
      pass: 'Support@123',
      org: 'HireFlow Platform Global',
      desc: 'Support desk: claim tickets, public replies vs internal notes (strictly separated), ticket status progression, and SLA resolution.',
      icon: Headphones,
      badge: 'Support Desk',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200'
    },
    {
      role: 'SUPPORT_MANAGER',
      title: 'Support Manager',
      name: 'Victoria Stirling',
      email: 'victoria.manager@hireflow.io',
      pass: 'Manager@123',
      org: 'HireFlow Platform Global',
      desc: 'Support operations command: team queue oversight, agent workload balancing, SLA breach monitors, ticket reassignments, and routing rules.',
      icon: Sliders,
      badge: 'Support Ops Lead',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-extrabold text-slate-900">1-Click Demo Persona Switcher</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Test all 7 user personas, role-based dashboards, and tenant isolation boundaries with instant switching.
            </p>
          </div>
          <button
            onClick={closeRoleSwitcher}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesList.map(r => {
            const Icon = r.icon;
            const isCurrent = currentUser.role === r.role;
            return (
              <div
                key={r.role}
                onClick={() => {
                  switchUserRole(r.role);
                  closeRoleSwitcher();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{r.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{r.name}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                    {r.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{r.desc}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="text-slate-500 font-mono">
                    <span className="font-bold text-slate-700">{r.email}</span>
                  </div>
                  {isCurrent ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-slate-500 hover:text-emerald-700">
                      <span>Switch</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
