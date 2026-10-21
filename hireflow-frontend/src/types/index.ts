export type UserRole =
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'RECRUITER'
  | 'STAFFING_AGENCY'
  | 'CANDIDATE'
  | 'SUPPORT_AGENT'
  | 'SUPPORT_MANAGER';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' | 'HYBRID' | 'INTERNSHIP';

export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'ARCHIVED';

export type ApplicationStage =
  | 'APPLIED'
  | 'SCREENING'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_IN_PROGRESS'
  | 'INTERVIEW_COMPLETED'
  | 'OFFER_PENDING'
  | 'OFFER_SENT'
  | 'OFFER_ACCEPTED'
  | 'OFFER_DECLINED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type InterviewType = 'VIDEO' | 'PHONE' | 'IN_PERSON';

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export type OfferStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export type TicketCategory =
  | 'CANDIDATE_APPLICATION'
  | 'RECRUITER_JOB_POSTING'
  | 'INTERVIEW_SCHEDULING'
  | 'AGENCY_SUBMISSION'
  | 'ORG_PERMISSIONS'
  | 'PLATFORM_SYSTEM'
  | 'BILLING'
  | 'OTHER';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TicketStatus =
  | 'OPEN'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export type SupportQueue =
  | 'CANDIDATE_SUPPORT'
  | 'RECRUITMENT_SUPPORT'
  | 'RECRUITMENT_OPS_SUPPORT'
  | 'AGENCY_SUPPORT'
  | 'ORG_SUPPORT'
  | 'PLATFORM_SUPPORT'
  | 'GENERAL_TRIAGE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  avatar?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  department?: string;
  title?: string;
  phone?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: 'ENTERPRISE' | 'GROWTH' | 'STARTER';
  status: 'ACTIVE' | 'SUSPENDED';
  domain: string;
  activeJobsCount: number;
  totalHiresCount: number;
  departments: string[];
  createdAt: string;
}

export interface Job {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  department: string;
  location: string;
  type: EmploymentType;
  status: JobStatus;
  experienceLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  requirements: string[];
  skills: string[];
  hiringManager: string;
  recruiterId: string;
  recruiterName: string;
  applicantsCount: number;
  closingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  experienceYears: number;
  skills: string[];
  resumeUrl: string;
  resumeName: string;
  rating: number; // 1 to 5
  tags: string[];
  bio: string;
  education: string;
  createdAt: string;
}

export interface StageHistoryEvent {
  stage: ApplicationStage;
  timestamp: string;
  actorName: string;
  notes?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDepartment: string;
  organizationId: string;
  organizationName: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateTitle: string;
  candidateLocation: string;
  candidateExperienceYears: number;
  candidateSkills: string[];
  matchScore: number; // 0 to 100%
  stage: ApplicationStage;
  appliedDate: string;
  stageUpdatedAt: string;
  recruiterNotes: string;
  rating: number;
  resumeName: string;
  stageHistory: StageHistoryEvent[];
}

export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  organizationId: string;
  roundName: string;
  roundNumber: number;
  type: InterviewType;
  scheduledAt: string;
  durationMinutes: number;
  interviewers: string[];
  meetingUrl: string;
  status: InterviewStatus;
  feedbackScore?: number;
  feedbackNotes?: string;
  conflictDetected?: boolean;
}

export interface Offer {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  organizationId: string;
  organizationName: string;
  baseSalary: number;
  bonus: number;
  equity?: string;
  currency: string;
  startDate: string;
  expirationDate: string;
  status: OfferStatus;
  notes?: string;
  sentAt?: string;
  respondedAt?: string;
}

export interface AgencyClient {
  id: string;
  agencyId: string;
  clientOrgId: string;
  clientOrgName: string;
  contactPerson: string;
  contactEmail: string;
  activeRequisitionsCount: number;
  commissionRatePercent: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CandidateSubmission {
  id: string;
  agencyId: string;
  agencyName: string;
  clientOrgId: string;
  clientOrgName: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  status: 'SUBMITTED' | 'UNDER_CLIENT_REVIEW' | 'CLIENT_INTERVIEW' | 'OFFERED' | 'PLACED' | 'REJECTED';
  submittedAt: string;
  clientFeedback?: string;
  commissionEarned?: number;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  isInternalNote: boolean;
  content: string;
  timestamp: string;
  attachmentName?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. TKT-2026-8912
  userId: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  organizationId: string;
  organizationName: string;
  category: TicketCategory;
  affectedModule: string;
  priority: TicketPriority;
  status: TicketStatus;
  queue: SupportQueue;
  assignedAgentId?: string;
  assignedAgentName?: string;
  subject: string;
  description: string;
  attachmentName?: string;
  slaDueHours: number;
  createdAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  isOverdue?: boolean;
  messages: TicketMessage[];
  statusHistory: {
    status: TicketStatus;
    actor: string;
    timestamp: string;
    reason?: string;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPLICATION' | 'INTERVIEW' | 'OFFER' | 'SUPPORT' | 'SYSTEM';
  linkTab?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  organizationId: string;
  organizationName: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}
