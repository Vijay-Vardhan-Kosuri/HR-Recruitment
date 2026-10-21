import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  Briefcase,
  Users,
  Calendar,
  Gift,
  Building,
  Send,
  Ticket,
  Headphones,
  Sliders,
  ShieldAlert,
  BarChart3,
  FileText,
  UserCheck,
  Search,
  Sparkles,
  LifeBuoy
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    applications,
    jobs,
    interviews,
    offers,
    supportTickets,
    openHelpModal
  } = useApp();

  // Role-specific badge calculations
  const pendingApps = applications.filter(a => a.stage === 'APPLIED' || a.stage === 'SCREENING').length;
  const scheduledInterviews = interviews.filter(i => i.status === 'SCHEDULED').length;
  const activeOffers = offers.filter(o => o.status === 'SENT' || o.status === 'PENDING_APPROVAL').length;
  const openTicketsCount = supportTickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
  const myAssignedTickets = supportTickets.filter(
    t => t.assignedAgentId === currentUser.id && t.status !== 'RESOLVED' && t.status !== 'CLOSED'
  ).length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }

  const getRoleMenuItems = (): { section: string; items: NavItem[] }[] => {
    switch (currentUser.role) {
      case 'SUPER_ADMIN':
        return [
          {
            section: 'Platform Command',
            items: [
              { id: 'superadmin-overview', label: 'Platform Overview', icon: LayoutDashboard },
              { id: 'superadmin-tenants', label: 'Tenants & Orgs', icon: Building },
              { id: 'superadmin-users', label: 'Global Accounts', icon: Users },
              { id: 'superadmin-tickets', label: 'Platform Tickets', icon: Ticket, badge: openTicketsCount, badgeColor: 'bg-rose-500' },
              { id: 'superadmin-system', label: 'System Health & SLAs', icon: Sliders }
            ]
          }
        ];

      case 'ORG_ADMIN':
        return [
          {
            section: 'Organization Administration',
            items: [
              { id: 'orgadmin-overview', label: 'Organization Overview', icon: LayoutDashboard },
              { id: 'orgadmin-team', label: 'Hiring Team & Roles', icon: Users },
              { id: 'orgadmin-jobs', label: 'Job Requisitions', icon: Briefcase, badge: jobs.length },
              { id: 'orgadmin-analytics', label: 'Hiring Velocity', icon: BarChart3 }
            ]
          }
        ];

      case 'RECRUITER':
        return [
          {
            section: 'Recruitment Operations',
            items: [
              { id: 'recruiter-pipeline', label: 'Pipeline (Kanban)', icon: Kanban, badge: pendingApps, badgeColor: 'bg-emerald-600' },
              { id: 'recruiter-jobs', label: 'My Job Openings', icon: Briefcase, badge: jobs.length },
              { id: 'recruiter-candidates', label: 'Candidates Roster', icon: Users },
              { id: 'recruiter-interviews', label: 'Interviews Calendar', icon: Calendar, badge: scheduledInterviews },
              { id: 'recruiter-offers', label: 'Offers & Approvals', icon: Gift, badge: activeOffers, badgeColor: 'bg-amber-600' }
            ]
          }
        ];

      case 'STAFFING_AGENCY':
        return [
          {
            section: 'Agency Partner Portal',
            items: [
              { id: 'agency-overview', label: 'Agency Command', icon: LayoutDashboard },
              { id: 'agency-clients', label: 'Client Requisitions', icon: Building },
              { id: 'agency-submissions', label: 'Candidate Submissions', icon: Send },
              { id: 'agency-placements', label: 'Placements & Fees', icon: Gift }
            ]
          }
        ];

      case 'CANDIDATE':
        return [
          {
            section: 'Candidate Career Hub',
            items: [
              { id: 'candidate-jobs', label: 'Search Open Roles', icon: Search },
              { id: 'candidate-applications', label: 'My Applications', icon: FileText, badge: applications.filter(a => a.candidateId === currentUser.id).length },
              { id: 'candidate-interviews', label: 'Interview Invites', icon: Calendar },
              { id: 'candidate-offers', label: 'Offers & Contracts', icon: Gift, badge: offers.filter(o => o.candidateId === currentUser.id && o.status === 'SENT').length, badgeColor: 'bg-emerald-600' },
              { id: 'candidate-profile', label: 'My Resume & Profile', icon: UserCheck }
            ]
          }
        ];

      case 'SUPPORT_AGENT':
        return [
          {
            section: 'Support Queue Desk',
            items: [
              { id: 'support-agent', label: 'My Ticket Queue', icon: Headphones, badge: myAssignedTickets, badgeColor: 'bg-rose-500' },
              { id: 'support-all-tickets', label: 'Team All Tickets', icon: Ticket, badge: openTicketsCount }
            ]
          }
        ];

      case 'SUPPORT_MANAGER':
        return [
          {
            section: 'Support Operations Center',
            items: [
              { id: 'support-manager', label: 'SLA Operations Center', icon: Sliders },
              { id: 'support-all-tickets', label: 'Global Queues & Triage', icon: Ticket, badge: openTicketsCount, badgeColor: 'bg-rose-500' },
              { id: 'support-analytics', label: 'Support & SLA Metrics', icon: BarChart3 }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const commonSections: { section: string; items: NavItem[] }[] = [
    {
      section: 'Platform Shared',
      items: [
        { id: 'common-jobs', label: 'All Jobs Directory', icon: Briefcase },
        { id: 'common-analytics', label: 'Analytics & Reports', icon: BarChart3 },
        { id: 'common-audit', label: 'Audit Trail & Logs', icon: ShieldAlert }
      ]
    }
  ];

  const menuSections = [...getRoleMenuItems(), ...commonSections];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current Active Persona Card */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
            {currentUser.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
            <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider truncate">
              {currentUser.role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-3 space-y-6 overflow-y-auto">
        {menuSections.map((group, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.section}
            </div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full text-white ${
                        isActive ? 'bg-emerald-800' : item.badgeColor || 'bg-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Help & Support Banner Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <button
          onClick={openHelpModal}
          className="w-full p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 transition-colors text-left flex items-center gap-2.5 cursor-pointer"
        >
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
            <LifeBuoy className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">Grievance & Support</div>
            <div className="text-[10px] text-emerald-700">Auto-routed Helpdesk</div>
          </div>
        </button>
      </div>
    </aside>
  );
};
