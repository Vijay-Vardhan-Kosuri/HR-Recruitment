import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Organization,
  Job,
  Candidate,
  Application,
  ApplicationStage,
  Interview,
  Offer,
  AgencyClient,
  CandidateSubmission,
  SupportTicket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  SupportQueue,
  TicketMessage,
  Notification,
  AuditLog
} from '../types';

import {
  SEED_ORGANIZATIONS,
  SEED_USERS,
  SEED_JOBS,
  SEED_CANDIDATES,
  SEED_APPLICATIONS,
  SEED_INTERVIEWS,
  SEED_OFFERS,
  SEED_AGENCY_CLIENTS,
  SEED_CANDIDATE_SUBMISSIONS,
  SEED_SUPPORT_TICKETS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS
} from '../data/seedData';

interface AppContextType {
  // Active User & Tenant Navigation
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;
  allUsers: User[];
  activeOrg: Organization;
  switchOrganization: (orgId: string) => void;
  organizations: Organization[];
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Modals
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;
  isRoleSwitcherOpen: boolean;
  openRoleSwitcher: () => void;
  closeRoleSwitcher: () => void;

  // Domain Collections
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  offers: Offer[];
  agencyClients: AgencyClient[];
  candidateSubmissions: CandidateSubmission[];
  supportTickets: SupportTicket[];
  notifications: Notification[];
  auditLogs: AuditLog[];

  // Recruitment Operations
  createJob: (jobData: Partial<Job>) => Job;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  changeJobStatus: (jobId: string, status: Job['status']) => void;
  applyToJob: (jobId: string, candidateData: Partial<Candidate>, resumeName?: string) => { success: boolean; error?: string; application?: Application };
  advanceApplicationStage: (applicationId: string, newStage: ApplicationStage, notes?: string) => void;
  rejectApplication: (applicationId: string, reason?: string) => void;
  withdrawApplication: (applicationId: string) => void;
  rateCandidate: (candidateId: string, rating: number) => void;

  // Interview Operations
  scheduleInterview: (interviewData: Omit<Interview, 'id' | 'status'>) => { success: boolean; error?: string; interview?: Interview };
  submitInterviewFeedback: (interviewId: string, score: number, notes: string) => void;
  cancelInterview: (interviewId: string, reason?: string) => void;

  // Offer Operations
  createOffer: (offerData: Omit<Offer, 'id' | 'status'>) => Offer;
  sendOffer: (offerId: string) => void;
  respondToOffer: (offerId: string, response: 'ACCEPTED' | 'DECLINED', notes?: string) => void;

  // Agency Operations
  submitAgencyCandidate: (submissionData: Omit<CandidateSubmission, 'id' | 'status' | 'submittedAt'>) => CandidateSubmission;

  // Support System & Automatic Routing
  raiseTicket: (params: {
    category: TicketCategory;
    affectedModule: string;
    priority: TicketPriority;
    subject: string;
    description: string;
    attachmentName?: string;
  }) => SupportTicket;
  replyToTicket: (ticketId: string, content: string, isInternalNote?: boolean, attachmentName?: string) => void;
  updateTicketStatus: (ticketId: string, newStatus: TicketStatus, reason?: string) => void;
  assignTicket: (ticketId: string, agentId: string, agentName: string) => void;
  escalateTicket: (ticketId: string, reason: string) => void;

  // Notifications & Audit
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  addAuditLog: (action: string, entity: string, details: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'HIREFLOW_DATA_V1_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    // Ignore storage quota
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('recruiter-pipeline');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  // Entities
  const [organizations, setOrganizations] = useState<Organization[]>(() => loadStorage('ORGS', SEED_ORGANIZATIONS));
  const [users, setUsers] = useState<User[]>(() => loadStorage('USERS', SEED_USERS));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadStorage<User | null>('CURRENT_USER', null);
    return saved || SEED_USERS[2]; // Default to Recruiter (Marcus Holloway)
  });

  const [activeOrgId, setActiveOrgId] = useState<string>(() => currentUser.organizationId || 'org-acme');

  const [jobs, setJobs] = useState<Job[]>(() => loadStorage('JOBS', SEED_JOBS));
  const [candidates, setCandidates] = useState<Candidate[]>(() => loadStorage('CANDIDATES', SEED_CANDIDATES));
  const [applications, setApplications] = useState<Application[]>(() => loadStorage('APPLICATIONS', SEED_APPLICATIONS));
  const [interviews, setInterviews] = useState<Interview[]>(() => loadStorage('INTERVIEWS', SEED_INTERVIEWS));
  const [offers, setOffers] = useState<Offer[]>(() => loadStorage('OFFERS', SEED_OFFERS));
  const [agencyClients, setAgencyClients] = useState<AgencyClient[]>(() => loadStorage('AGENCY_CLIENTS', SEED_AGENCY_CLIENTS));
  const [candidateSubmissions, setCandidateSubmissions] = useState<CandidateSubmission[]>(() => loadStorage('SUBMISSIONS', SEED_CANDIDATE_SUBMISSIONS));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => loadStorage('TICKETS', SEED_SUPPORT_TICKETS));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadStorage('NOTIFICATIONS', SEED_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorage('AUDIT_LOGS', SEED_AUDIT_LOGS));

  // Sync to Storage
  useEffect(() => saveStorage('ORGS', organizations), [organizations]);
  useEffect(() => saveStorage('USERS', users), [users]);
  useEffect(() => saveStorage('CURRENT_USER', currentUser), [currentUser]);
  useEffect(() => saveStorage('JOBS', jobs), [jobs]);
  useEffect(() => saveStorage('CANDIDATES', candidates), [candidates]);
  useEffect(() => saveStorage('APPLICATIONS', applications), [applications]);
  useEffect(() => saveStorage('INTERVIEWS', interviews), [interviews]);
  useEffect(() => saveStorage('OFFERS', offers), [offers]);
  useEffect(() => saveStorage('AGENCY_CLIENTS', agencyClients), [agencyClients]);
  useEffect(() => saveStorage('SUBMISSIONS', candidateSubmissions), [candidateSubmissions]);
  useEffect(() => saveStorage('TICKETS', supportTickets), [supportTickets]);
  useEffect(() => saveStorage('NOTIFICATIONS', notifications), [notifications]);
  useEffect(() => saveStorage('AUDIT_LOGS', auditLogs), [auditLogs]);

  // Derived Active Org
  const activeOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const switchOrganization = (orgId: string) => {
    setActiveOrgId(orgId);
    addAuditLog('TENANT_SWITCH', `Organization`, `Switched active organization scope to ${orgId}`);
  };

  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || SEED_USERS.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (targetUser.organizationId && targetUser.organizationId !== 'org-platform' && targetUser.organizationId !== 'org-candidate') {
        setActiveOrgId(targetUser.organizationId);
      }
      // Route to role default tab
      switch (role) {
        case 'SUPER_ADMIN':
          setActiveTab('superadmin-overview');
          break;
        case 'ORG_ADMIN':
          setActiveTab('orgadmin-overview');
          break;
        case 'RECRUITER':
          setActiveTab('recruiter-pipeline');
          break;
        case 'STAFFING_AGENCY':
          setActiveTab('agency-overview');
          break;
        case 'CANDIDATE':
          setActiveTab('candidate-jobs');
          break;
        case 'SUPPORT_AGENT':
          setActiveTab('support-agent');
          break;
        case 'SUPPORT_MANAGER':
          setActiveTab('support-manager');
          break;
      }
    }
  };

  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);
  const openRoleSwitcher = () => setIsRoleSwitcherOpen(true);
  const closeRoleSwitcher = () => setIsRoleSwitcherOpen(false);

  const addAuditLog = (action: string, entity: string, details: string) => {
    const entry: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      organizationId: activeOrg.id,
      organizationName: activeOrg.name,
      action,
      entity,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '127.0.0.1 (Localhost)'
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  // Job Management
  const createJob = (jobData: Partial<Job>): Job => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      organizationId: activeOrg.id,
      organizationName: activeOrg.name,
      title: jobData.title || 'Untitled Requisition',
      department: jobData.department || 'Engineering',
      location: jobData.location || 'Remote',
      type: jobData.type || 'FULL_TIME',
      status: jobData.status || 'PUBLISHED',
      experienceLevel: jobData.experienceLevel || 'MID',
      salaryMin: jobData.salaryMin || 120000,
      salaryMax: jobData.salaryMax || 160000,
      currency: jobData.currency || 'USD',
      description: jobData.description || 'Job role description',
      requirements: jobData.requirements || ['Relevant industry experience', 'Strong team communication'],
      skills: jobData.skills || ['React', 'TypeScript', 'Node.js'],
      hiringManager: jobData.hiringManager || currentUser.name,
      recruiterId: currentUser.id,
      recruiterName: currentUser.name,
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setJobs(prev => [newJob, ...prev]);
    addAuditLog('JOB_CREATED', `Job #${newJob.id}`, `Published job requisition: "${newJob.title}"`);
    return newJob;
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : j)));
    addAuditLog('JOB_UPDATED', `Job #${jobId}`, `Updated job parameters`);
  };

  const changeJobStatus = (jobId: string, status: Job['status']) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString().split('T')[0] } : j)));
    addAuditLog('JOB_STATUS_CHANGE', `Job #${jobId}`, `Changed status to ${status}`);
  };

  // Candidate Applications & Pipeline Progression
  const applyToJob = (jobId: string, candidateData: Partial<Candidate>, resumeName?: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return { success: false, error: 'Job not found' };

    // Duplicate check
    const existing = applications.find(
      a => a.jobId === jobId && (a.candidateEmail.toLowerCase() === (candidateData.email || '').toLowerCase() || a.candidateId === currentUser.id)
    );
    if (existing) {
      return { success: false, error: 'Duplicate application detected: Candidate has already applied for this role.' };
    }

    // Candidate lookup or creation
    let candId = currentUser.role === 'CANDIDATE' ? currentUser.id : `cand-${Date.now()}`;
    const candName = candidateData.name || currentUser.name;
    const candEmail = candidateData.email || currentUser.email;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      jobDepartment: targetJob.department,
      organizationId: targetJob.organizationId,
      organizationName: targetJob.organizationName,
      candidateId: candId,
      candidateName: candName,
      candidateEmail: candEmail,
      candidatePhone: candidateData.phone || '+1 (555) 234-5678',
      candidateTitle: candidateData.currentTitle || 'Software Engineer',
      candidateLocation: candidateData.location || 'Remote',
      candidateExperienceYears: candidateData.experienceYears || 5,
      candidateSkills: candidateData.skills || targetJob.skills,
      matchScore: Math.floor(82 + Math.random() * 16),
      stage: 'APPLIED',
      appliedDate: new Date().toISOString().split('T')[0],
      stageUpdatedAt: new Date().toISOString().split('T')[0],
      recruiterNotes: 'Application submitted via HireFlow portal.',
      rating: 4,
      resumeName: resumeName || `${candName.replace(' ', '_')}_Resume_2026.pdf`,
      stageHistory: [
        {
          stage: 'APPLIED',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actorName: candName,
          notes: 'Direct application submitted'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j)));

    // In-app notification to recruiter
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: targetJob.recruiterId,
      title: 'New Candidate Applied',
      message: `${candName} applied for "${targetJob.title}" (Match: ${newApp.matchScore}%)`,
      type: 'APPLICATION',
      linkTab: 'recruiter-pipeline',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('APPLICATION_SUBMITTED', `Application #${newApp.id}`, `${candName} applied to ${targetJob.title}`);
    return { success: true, application: newApp };
  };

  const advanceApplicationStage = (applicationId: string, newStage: ApplicationStage, notes?: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== applicationId) return app;
        const newHistoryItem = {
          stage: newStage,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          actorName: currentUser.name,
          notes: notes || `Advanced to ${newStage}`
        };
        return {
          ...app,
          stage: newStage,
          stageUpdatedAt: new Date().toISOString().split('T')[0],
          recruiterNotes: notes ? `${app.recruiterNotes}\n[${newStage}]: ${notes}` : app.recruiterNotes,
          stageHistory: [...app.stageHistory, newHistoryItem]
        };
      })
    );

    const app = applications.find(a => a.id === applicationId);
    if (app) {
      // In-app notification to candidate
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: app.candidateId,
        title: 'Application Status Updated',
        message: `Your application for "${app.jobTitle}" at ${app.organizationName} is now: ${newStage.replace(/_/g, ' ')}`,
        type: 'APPLICATION',
        linkTab: 'candidate-applications',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setNotifications(prev => [notif, ...prev]);
    }

    addAuditLog('STAGE_TRANSITION', `Application #${applicationId}`, `Advanced stage to ${newStage}`);
  };

  const rejectApplication = (applicationId: string, reason?: string) => {
    advanceApplicationStage(applicationId, 'REJECTED', reason || 'Candidate does not meet current role specifications.');
  };

  const withdrawApplication = (applicationId: string) => {
    advanceApplicationStage(applicationId, 'WITHDRAWN', 'Application withdrawn by candidate.');
  };

  const rateCandidate = (candidateId: string, rating: number) => {
    setCandidates(prev => prev.map(c => (c.id === candidateId ? { ...c, rating } : c)));
    setApplications(prev => prev.map(a => (a.candidateId === candidateId ? { ...a, rating } : a)));
  };

  // Interview Management
  const scheduleInterview = (interviewData: Omit<Interview, 'id' | 'status'>) => {
    // Conflict detection: check if any interviewer is already scheduled within overlapping duration
    const targetTime = new Date(interviewData.scheduledAt).getTime();
    const durationMs = (interviewData.durationMinutes || 45) * 60 * 1000;

    const conflict = interviews.find(i => {
      if (i.status === 'CANCELLED') return false;
      const iTime = new Date(i.scheduledAt).getTime();
      const iDurationMs = i.durationMinutes * 60 * 1000;
      // Overlap check
      const overlaps = Math.max(targetTime, iTime) < Math.min(targetTime + durationMs, iTime + iDurationMs);
      if (!overlaps) return false;
      // Check shared interviewers
      return i.interviewers.some(interviewer => interviewData.interviewers.includes(interviewer));
    });

    if (conflict) {
      return {
        success: false,
        error: `Scheduling Conflict: An interviewer is already booked for another session at this time (${new Date(conflict.scheduledAt).toLocaleTimeString()}).`
      };
    }

    const newInterview: Interview = {
      ...interviewData,
      id: `intv-${Date.now()}`,
      status: 'SCHEDULED',
      meetingUrl: interviewData.meetingUrl || `https://meet.google.com/hfw-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`
    };

    setInterviews(prev => [newInterview, ...prev]);

    // Advance application stage
    advanceApplicationStage(interviewData.applicationId, 'INTERVIEW_SCHEDULED', `Scheduled ${interviewData.roundName}`);

    // Notify candidate
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: interviewData.candidateId,
      title: 'Interview Invitation Confirmed',
      message: `Interview scheduled for "${interviewData.jobTitle}" on ${new Date(interviewData.scheduledAt).toLocaleString()}`,
      type: 'INTERVIEW',
      linkTab: 'candidate-interviews',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('INTERVIEW_SCHEDULED', `Interview #${newInterview.id}`, `Booked ${newInterview.roundName} with ${newInterview.candidateName}`);
    return { success: true, interview: newInterview };
  };

  const submitInterviewFeedback = (interviewId: string, score: number, notes: string) => {
    setInterviews(prev =>
      prev.map(i => (i.id === interviewId ? { ...i, status: 'COMPLETED', feedbackScore: score, feedbackNotes: notes } : i))
    );

    const intv = interviews.find(i => i.id === interviewId);
    if (intv) {
      advanceApplicationStage(intv.applicationId, 'INTERVIEW_COMPLETED', `Evaluation Score: ${score}/5. Notes: ${notes}`);
    }

    addAuditLog('INTERVIEW_EVALUATION', `Interview #${interviewId}`, `Submitted feedback score: ${score}/5`);
  };

  const cancelInterview = (interviewId: string, reason?: string) => {
    setInterviews(prev => prev.map(i => (i.id === interviewId ? { ...i, status: 'CANCELLED' } : i)));
    addAuditLog('INTERVIEW_CANCELLED', `Interview #${interviewId}`, reason || 'Interview cancelled');
  };

  // Offer Management
  const createOffer = (offerData: Omit<Offer, 'id' | 'status'>): Offer => {
    const newOffer: Offer = {
      ...offerData,
      id: `off-${Date.now()}`,
      status: 'DRAFT',
      sentAt: new Date().toISOString()
    };
    setOffers(prev => [newOffer, ...prev]);
    advanceApplicationStage(offerData.applicationId, 'OFFER_PENDING', 'Executive offer drafted for approval.');
    addAuditLog('OFFER_DRAFTED', `Offer #${newOffer.id}`, `Drafted offer for ${newOffer.candidateName} ($${newOffer.baseSalary.toLocaleString()})`);
    return newOffer;
  };

  const sendOffer = (offerId: string) => {
    setOffers(prev => prev.map(o => (o.id === offerId ? { ...o, status: 'SENT', sentAt: new Date().toISOString() } : o)));

    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      advanceApplicationStage(offer.applicationId, 'OFFER_SENT', `Formal offer letter issued ($${offer.baseSalary.toLocaleString()} base salary).`);

      // Notify candidate
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: offer.candidateId,
        title: 'Official Offer Letter Received!',
        message: `${offer.organizationName} has extended an official offer for "${offer.jobTitle}". Click to review and respond.`,
        type: 'OFFER',
        linkTab: 'candidate-offers',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setNotifications(prev => [notif, ...prev]);
    }

    addAuditLog('OFFER_SENT', `Offer #${offerId}`, `Dispatched formal offer document to candidate`);
  };

  const respondToOffer = (offerId: string, response: 'ACCEPTED' | 'DECLINED', notes?: string) => {
    setOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: response, notes: notes || o.notes, respondedAt: new Date().toISOString() } : o))
    );

    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      if (response === 'ACCEPTED') {
        advanceApplicationStage(offer.applicationId, 'OFFER_ACCEPTED', `Offer accepted by candidate!`);
        // Move to HIRED
        advanceApplicationStage(offer.applicationId, 'HIRED', `Candidate finalized into HRIS.`);
        // Update agency submission if applicable
        setCandidateSubmissions(prev =>
          prev.map(s => (s.candidateId === offer.candidateId ? { ...s, status: 'PLACED' } : s))
        );
      } else {
        advanceApplicationStage(offer.applicationId, 'OFFER_DECLINED', notes || 'Offer declined by candidate.');
      }

      // Notify Recruiter
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: 'u-recruiter',
        title: `Offer ${response}: ${offer.candidateName}`,
        message: `${offer.candidateName} has ${response.toLowerCase()} the offer for "${offer.jobTitle}".`,
        type: 'OFFER',
        linkTab: 'recruiter-offers',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setNotifications(prev => [notif, ...prev]);
    }

    addAuditLog('OFFER_RESPONSE', `Offer #${offerId}`, `Candidate response: ${response}`);
  };

  // Staffing Agency Submission
  const submitAgencyCandidate = (submissionData: Omit<CandidateSubmission, 'id' | 'status' | 'submittedAt'>): CandidateSubmission => {
    const newSub: CandidateSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setCandidateSubmissions(prev => [newSub, ...prev]);

    // Also register an application on the client's job
    applyToJob(submissionData.jobId, {
      name: submissionData.candidateName,
      email: submissionData.candidateEmail,
      currentTitle: 'Agency Submitted Talent'
    });

    addAuditLog('AGENCY_SUBMISSION', `Submission #${newSub.id}`, `Submitted ${newSub.candidateName} to ${newSub.clientOrgName}`);
    return newSub;
  };

  // Central Customer Support & Automatic Routing Engine
  const raiseTicket = (params: {
    category: TicketCategory;
    affectedModule: string;
    priority: TicketPriority;
    subject: string;
    description: string;
    attachmentName?: string;
  }): SupportTicket => {
    // AUTOMATIC ROUTING ENGINE
    let targetQueue: SupportQueue = 'GENERAL_TRIAGE';
    if (params.category === 'CANDIDATE_APPLICATION' || currentUser.role === 'CANDIDATE') {
      targetQueue = 'CANDIDATE_SUPPORT';
    } else if (params.category === 'RECRUITER_JOB_POSTING') {
      targetQueue = 'RECRUITMENT_SUPPORT';
    } else if (params.category === 'INTERVIEW_SCHEDULING') {
      targetQueue = 'RECRUITMENT_OPS_SUPPORT';
    } else if (params.category === 'AGENCY_SUBMISSION' || currentUser.role === 'STAFFING_AGENCY') {
      targetQueue = 'AGENCY_SUPPORT';
    } else if (params.category === 'ORG_PERMISSIONS' || params.category === 'BILLING') {
      targetQueue = 'ORG_SUPPORT';
    } else if (params.category === 'PLATFORM_SYSTEM') {
      targetQueue = 'PLATFORM_SUPPORT';
    }

    // SLA Calculation based on priority
    const slaHoursMap: Record<TicketPriority, number> = {
      CRITICAL: 2,
      HIGH: 4,
      MEDIUM: 8,
      LOW: 24
    };
    const slaHours = slaHoursMap[params.priority] || 8;

    const ticketNo = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: ticketNo,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      organizationId: activeOrg.id,
      organizationName: activeOrg.name,
      category: params.category,
      affectedModule: params.affectedModule,
      priority: params.priority,
      status: 'OPEN',
      queue: targetQueue,
      subject: params.subject,
      description: params.description,
      attachmentName: params.attachmentName,
      slaDueHours: slaHours,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: `tkt-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          isInternalNote: false,
          content: params.description,
          timestamp: new Date().toISOString(),
          attachmentName: params.attachmentName
        }
      ],
      statusHistory: [
        {
          status: 'OPEN',
          actor: currentUser.name,
          timestamp: new Date().toISOString(),
          reason: 'Initial ticket creation'
        },
        {
          status: 'TRIAGED',
          actor: 'Automated Routing Engine',
          timestamp: new Date().toISOString(),
          reason: `Auto-routed by category ${params.category} to queue [${targetQueue}] with ${slaHours}h SLA target.`
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    // Notify Support Team
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'u-support-agent',
      title: `New Ticket [${params.priority}]: ${ticketNo}`,
      message: `${currentUser.name} raised ticket in queue ${targetQueue}: "${params.subject}"`,
      type: 'SUPPORT',
      linkTab: 'support-agent',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditLog('TICKET_CREATED', `Ticket #${ticketNo}`, `Routed to ${targetQueue} (${params.priority} priority)`);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, content: string, isInternalNote = false, attachmentName?: string) => {
    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      isInternalNote,
      content,
      timestamp: new Date().toISOString(),
      attachmentName
    };

    setSupportTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;

        const isFirstStaffResponse =
          !t.firstResponseAt &&
          (currentUser.role === 'SUPPORT_AGENT' || currentUser.role === 'SUPPORT_MANAGER') &&
          !isInternalNote;

        const nextStatus =
          currentUser.role === 'SUPPORT_AGENT' || currentUser.role === 'SUPPORT_MANAGER'
            ? isInternalNote ? t.status : 'WAITING_FOR_USER'
            : 'IN_PROGRESS';

        const updatedHistory =
          nextStatus !== t.status
            ? [
                ...t.statusHistory,
                {
                  status: nextStatus as TicketStatus,
                  actor: currentUser.name,
                  timestamp: new Date().toISOString(),
                  reason: isInternalNote ? 'Internal note added' : 'Reply posted'
                }
              ]
            : t.statusHistory;

        return {
          ...t,
          status: nextStatus as TicketStatus,
          firstResponseAt: isFirstStaffResponse ? new Date().toISOString() : t.firstResponseAt,
          messages: [...t.messages, newMessage],
          statusHistory: updatedHistory
        };
      })
    );

    const ticket = supportTickets.find(t => t.id === ticketId);
    if (ticket && !isInternalNote) {
      // Notify the other party!
      const recipientId = currentUser.id === ticket.userId ? ticket.assignedAgentId || 'u-support-agent' : ticket.userId;
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: recipientId,
        title: `Reply on Ticket ${ticket.ticketNumber}`,
        message: `${currentUser.name} posted: "${content.substring(0, 60)}..."`,
        type: 'SUPPORT',
        linkTab: 'help-support',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setNotifications(prev => [notif, ...prev]);
    }

    addAuditLog('TICKET_REPLY', `Ticket #${ticketId}`, isInternalNote ? 'Added staff internal note' : 'Sent public reply to user');
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus, reason?: string) => {
    setSupportTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;
        const resolvedAt = newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? new Date().toISOString() : t.resolvedAt;
        return {
          ...t,
          status: newStatus,
          resolvedAt,
          statusHistory: [
            ...t.statusHistory,
            {
              status: newStatus,
              actor: currentUser.name,
              timestamp: new Date().toISOString(),
              reason: reason || `Status changed to ${newStatus}`
            }
          ]
        };
      })
    );

    const ticket = supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: ticket.userId,
        title: `Ticket Status: ${newStatus}`,
        message: `Ticket ${ticket.ticketNumber} is now marked as ${newStatus}.`,
        type: 'SUPPORT',
        linkTab: 'help-support',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setNotifications(prev => [notif, ...prev]);
    }

    addAuditLog('TICKET_STATUS_UPDATE', `Ticket #${ticketId}`, `Status changed to ${newStatus}`);
  };

  const assignTicket = (ticketId: string, agentId: string, agentName: string) => {
    setSupportTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? {
              ...t,
              assignedAgentId: agentId,
              assignedAgentName: agentName,
              status: 'ASSIGNED',
              statusHistory: [
                ...t.statusHistory,
                {
                  status: 'ASSIGNED',
                  actor: currentUser.name,
                  timestamp: new Date().toISOString(),
                  reason: `Assigned to ${agentName}`
                }
              ]
            }
          : t
      )
    );
    addAuditLog('TICKET_ASSIGNED', `Ticket #${ticketId}`, `Assigned to ${agentName}`);
  };

  const escalateTicket = (ticketId: string, reason: string) => {
    setSupportTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? {
              ...t,
              priority: 'CRITICAL',
              status: 'ESCALATED',
              statusHistory: [
                ...t.statusHistory,
                {
                  status: 'ESCALATED',
                  actor: currentUser.name,
                  timestamp: new Date().toISOString(),
                  reason: `Escalation requested: ${reason}`
                }
              ]
            }
          : t
      )
    );
    addAuditLog('TICKET_ESCALATED', `Ticket #${ticketId}`, `Escalated: ${reason}`);
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setOrganizations(SEED_ORGANIZATIONS);
    setUsers(SEED_USERS);
    setCurrentUser(SEED_USERS[2]);
    setActiveOrgId('org-acme');
    setJobs(SEED_JOBS);
    setCandidates(SEED_CANDIDATES);
    setApplications(SEED_APPLICATIONS);
    setInterviews(SEED_INTERVIEWS);
    setOffers(SEED_OFFERS);
    setAgencyClients(SEED_AGENCY_CLIENTS);
    setCandidateSubmissions(SEED_CANDIDATE_SUBMISSIONS);
    setSupportTickets(SEED_SUPPORT_TICKETS);
    setNotifications(SEED_NOTIFICATIONS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setActiveTab('recruiter-pipeline');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        allUsers: users,
        activeOrg,
        switchOrganization,
        organizations,
        activeTab,
        setActiveTab,
        isHelpModalOpen,
        openHelpModal,
        closeHelpModal,
        isRoleSwitcherOpen,
        openRoleSwitcher,
        closeRoleSwitcher,
        jobs,
        setJobs,
        candidates,
        applications,
        interviews,
        offers,
        agencyClients,
        candidateSubmissions,
        supportTickets,
        notifications,
        auditLogs,
        createJob,
        updateJob,
        changeJobStatus,
        applyToJob,
        advanceApplicationStage,
        rejectApplication,
        withdrawApplication,
        rateCandidate,
        scheduleInterview,
        submitInterviewFeedback,
        cancelInterview,
        createOffer,
        sendOffer,
        respondToOffer,
        submitAgencyCandidate,
        raiseTicket,
        replyToTicket,
        updateTicketStatus,
        assignTicket,
        escalateTicket,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addAuditLog,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
