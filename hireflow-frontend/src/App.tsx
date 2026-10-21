import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DemoRoleSwitcherModal } from './components/common/DemoRoleSwitcherModal';
import { SupportHubModal } from './components/common/SupportHubModal';

// Pages
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { OrgAdminDashboard } from './pages/orgadmin/OrgAdminDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { AgencyDashboard } from './pages/agency/AgencyDashboard';
import { CandidatePortal } from './pages/candidate/CandidatePortal';
import { SupportAgentDashboard } from './pages/support/SupportAgentDashboard';
import { SupportManagerDashboard } from './pages/support/SupportManagerDashboard';
import { JobsDirectoryPage } from './pages/common/JobsDirectoryPage';
import { ReportsAnalyticsPage } from './pages/common/ReportsAnalyticsPage';
import { AuditLogsPage } from './pages/common/AuditLogsPage';

export const App: React.FC = () => {
  const { activeTab, currentUser } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      // Super Admin
      case 'superadmin-overview':
      case 'superadmin-tenants':
      case 'superadmin-users':
      case 'superadmin-tickets':
      case 'superadmin-system':
        return <SuperAdminDashboard />;

      // Org Admin
      case 'orgadmin-overview':
      case 'orgadmin-team':
      case 'orgadmin-jobs':
      case 'orgadmin-analytics':
        return <OrgAdminDashboard />;

      // Recruiter
      case 'recruiter-pipeline':
      case 'recruiter-jobs':
      case 'recruiter-candidates':
      case 'recruiter-interviews':
      case 'recruiter-offers':
        return <RecruiterDashboard />;

      // Staffing Agency
      case 'agency-overview':
      case 'agency-clients':
      case 'agency-submissions':
      case 'agency-placements':
        return <AgencyDashboard />;

      // Candidate Portal
      case 'candidate-jobs':
      case 'candidate-applications':
      case 'candidate-interviews':
      case 'candidate-offers':
      case 'candidate-profile':
        return <CandidatePortal />;

      // Support Desk
      case 'support-agent':
      case 'support-all-tickets':
      case 'help-support':
        return currentUser.role === 'SUPPORT_MANAGER' ? <SupportManagerDashboard /> : <SupportAgentDashboard />;

      case 'support-manager':
      case 'support-analytics':
        return <SupportManagerDashboard />;

      // Platform Shared
      case 'common-jobs':
        return <JobsDirectoryPage />;
      case 'common-analytics':
        return <ReportsAnalyticsPage />;
      case 'common-audit':
        return <AuditLogsPage />;

      default:
        // Role default fallback
        switch (currentUser.role) {
          case 'SUPER_ADMIN':
            return <SuperAdminDashboard />;
          case 'ORG_ADMIN':
            return <OrgAdminDashboard />;
          case 'RECRUITER':
            return <RecruiterDashboard />;
          case 'STAFFING_AGENCY':
            return <AgencyDashboard />;
          case 'CANDIDATE':
            return <CandidatePortal />;
          case 'SUPPORT_AGENT':
            return <SupportAgentDashboard />;
          case 'SUPPORT_MANAGER':
            return <SupportManagerDashboard />;
          default:
            return <RecruiterDashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Universal Modals */}
      <DemoRoleSwitcherModal />
      <SupportHubModal />
    </div>
  );
};
