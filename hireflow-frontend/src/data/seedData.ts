import {
  User,
  Organization,
  Job,
  Candidate,
  Application,
  Interview,
  Offer,
  AgencyClient,
  CandidateSubmission,
  SupportTicket,
  Notification,
  AuditLog
} from '../types';

export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-acme',
    name: 'Acme Technologies Inc.',
    slug: 'acme-corp',
    tier: 'ENTERPRISE',
    status: 'ACTIVE',
    domain: 'acmecorp.com',
    activeJobsCount: 14,
    totalHiresCount: 88,
    departments: ['Engineering', 'Product & Design', 'Sales & RevOps', 'Marketing', 'Customer Success'],
    createdAt: '2024-01-15'
  },
  {
    id: 'org-technova',
    name: 'TechNova Cloud Systems',
    slug: 'technova',
    tier: 'GROWTH',
    status: 'ACTIVE',
    domain: 'technova.io',
    activeJobsCount: 6,
    totalHiresCount: 32,
    departments: ['Platform Engineering', 'Data & AI', 'Security', 'Operations'],
    createdAt: '2024-06-10'
  },
  {
    id: 'org-globalstaff',
    name: 'GlobalStaff Partners Agency',
    slug: 'globalstaff-agency',
    tier: 'ENTERPRISE',
    status: 'ACTIVE',
    domain: 'globalstaff.com',
    activeJobsCount: 22,
    totalHiresCount: 140,
    departments: ['Tech Staffing', 'Executive Search', 'Contract Placement'],
    createdAt: '2023-11-01'
  }
];

export const SEED_USERS: User[] = [
  {
    id: 'u-superadmin',
    name: 'Alexander Vance',
    email: 'superadmin@hireflow.io',
    role: 'SUPER_ADMIN',
    organizationId: 'org-platform',
    organizationName: 'HireFlow Platform Global',
    status: 'ACTIVE',
    department: 'Platform Operations',
    title: 'Chief Platform Architect',
    phone: '+1 (555) 901-2001',
    createdAt: '2024-01-01'
  },
  {
    id: 'u-orgadmin',
    name: 'Sarah Jenkins',
    email: 'sarah.admin@acmecorp.com',
    role: 'ORG_ADMIN',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    status: 'ACTIVE',
    department: 'People & Talent',
    title: 'VP of Global Talent Acquisition',
    phone: '+1 (555) 823-4412',
    createdAt: '2024-01-16'
  },
  {
    id: 'u-recruiter',
    name: 'Marcus Holloway',
    email: 'marcus.recruiter@acmecorp.com',
    role: 'RECRUITER',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    status: 'ACTIVE',
    department: 'Engineering Recruitment',
    title: 'Lead Technical Recruiter',
    phone: '+1 (555) 349-8821',
    createdAt: '2024-02-01'
  },
  {
    id: 'u-agency',
    name: 'Elena Rostova',
    email: 'elena.agency@globalstaff.com',
    role: 'STAFFING_AGENCY',
    organizationId: 'org-globalstaff',
    organizationName: 'GlobalStaff Partners Agency',
    status: 'ACTIVE',
    department: 'Executive Search',
    title: 'Managing Director & Partner',
    phone: '+1 (555) 492-7103',
    createdAt: '2024-02-15'
  },
  {
    id: 'u-candidate',
    name: 'Alex Chen',
    email: 'alex.dev@gmail.com',
    role: 'CANDIDATE',
    organizationId: 'org-candidate',
    organizationName: 'Individual Candidate',
    status: 'ACTIVE',
    department: 'Applicant',
    title: 'Senior Full Stack & Cloud Architect',
    phone: '+1 (555) 219-4832',
    createdAt: '2024-03-01'
  },
  {
    id: 'u-support-agent',
    name: 'Jordan Miller',
    email: 'jordan.support@hireflow.io',
    role: 'SUPPORT_AGENT',
    organizationId: 'org-platform',
    organizationName: 'HireFlow Platform Global',
    status: 'ACTIVE',
    department: 'Customer Care & Triage',
    title: 'Senior Support Tier-2 Engineer',
    phone: '+1 (555) 602-1194',
    createdAt: '2024-01-20'
  },
  {
    id: 'u-support-manager',
    name: 'Victoria Stirling',
    email: 'victoria.manager@hireflow.io',
    role: 'SUPPORT_MANAGER',
    organizationId: 'org-platform',
    organizationName: 'HireFlow Platform Global',
    status: 'ACTIVE',
    department: 'Support Operations',
    title: 'Global Head of Customer Support & SLAs',
    phone: '+1 (555) 781-9920',
    createdAt: '2024-01-10'
  }
];

export const SEED_JOBS: Job[] = [
  {
    id: 'job-101',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    title: 'Senior Full Stack Engineer (React & Go/Java)',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid / Remote Option)',
    type: 'FULL_TIME',
    status: 'PUBLISHED',
    experienceLevel: 'SENIOR',
    salaryMin: 165000,
    salaryMax: 195000,
    currency: 'USD',
    description: 'Lead architecture and end-to-end feature delivery for our real-time cloud data pipelines and responsive React web applications.',
    requirements: [
      '5+ years building production-grade web systems in TypeScript and Go/Java',
      'Solid experience with distributed systems, PostgreSQL, and event streaming',
      'Strong eye for accessible UI components and modern styling'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'RESTful APIs', 'Tailwind CSS'],
    hiringManager: 'David K., Director of Core Engineering',
    recruiterId: 'u-recruiter',
    recruiterName: 'Marcus Holloway',
    applicantsCount: 24,
    closingDate: '2026-12-31',
    createdAt: '2026-09-01',
    updatedAt: '2026-10-15'
  },
  {
    id: 'job-102',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    title: 'Staff Cloud Infrastructure Architect (K8s & AWS)',
    department: 'Engineering',
    location: 'Austin, TX (Remote)',
    type: 'FULL_TIME',
    status: 'PUBLISHED',
    experienceLevel: 'LEAD',
    salaryMin: 190000,
    salaryMax: 230000,
    currency: 'USD',
    description: 'Scale our multi-region Kubernetes infrastructure, optimize cost efficiency, and automate zero-downtime CI/CD deployments.',
    requirements: [
      '7+ years cloud infrastructure engineering on AWS or GCP',
      'Production mastery of Kubernetes, Terraform, Prometheus, and Helm',
      'Security posture hardening and SOC-2 compliance expertise'
    ],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Go', 'Docker', 'CI/CD', 'Prometheus'],
    hiringManager: 'Evelyn Reed, VP of Infrastructure',
    recruiterId: 'u-recruiter',
    recruiterName: 'Marcus Holloway',
    applicantsCount: 16,
    closingDate: '2026-11-30',
    createdAt: '2026-09-10',
    updatedAt: '2026-10-18'
  },
  {
    id: 'job-103',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    title: 'Principal Product Manager — Enterprise Workflow',
    department: 'Product & Design',
    location: 'New York, NY (Hybrid)',
    type: 'FULL_TIME',
    status: 'PUBLISHED',
    experienceLevel: 'SENIOR',
    salaryMin: 175000,
    salaryMax: 210000,
    currency: 'USD',
    description: 'Drive the strategic roadmap for B2B SaaS automated workflow orchestration, collaborating closely with UX and enterprise buyers.',
    requirements: [
      '6+ years product management experience in enterprise SaaS products',
      'Demonstrated track record of shipping complex multi-persona platforms',
      'Data-driven decision making and excellent stakeholder alignment'
    ],
    skills: ['Product Strategy', 'User Research', 'Roadmapping', 'Agile/Scrum', 'Analytics', 'SQL'],
    hiringManager: 'Rachel Zhang, VP of Product',
    recruiterId: 'u-recruiter',
    recruiterName: 'Marcus Holloway',
    applicantsCount: 19,
    closingDate: '2026-12-15',
    createdAt: '2026-09-15',
    updatedAt: '2026-10-12'
  },
  {
    id: 'job-104',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    title: 'Senior Enterprise Account Executive (FinTech & Tech)',
    department: 'Sales & RevOps',
    location: 'Chicago, IL (Remote)',
    type: 'FULL_TIME',
    status: 'PUBLISHED',
    experienceLevel: 'SENIOR',
    salaryMin: 140000,
    salaryMax: 280000,
    currency: 'USD',
    description: 'Own enterprise sales pipeline from initial discovery to closing high-value annual contracts with Fortune 500 tech firms.',
    requirements: [
      '5+ years direct quota-carrying software sales experience',
      'Consistent history of exceeding $1.5M+ annual ARR quotas',
      'Deep consultative sales methodology (MEDDPICC / Challenger)'
    ],
    skills: ['Enterprise SaaS', 'MEDDPICC', 'Salesforce', 'Contract Negotiation', 'Discovery Calls'],
    hiringManager: 'Mark Thorne, CRO',
    recruiterId: 'u-recruiter',
    recruiterName: 'Marcus Holloway',
    applicantsCount: 11,
    closingDate: '2026-12-31',
    createdAt: '2026-09-20',
    updatedAt: '2026-10-10'
  },
  {
    id: 'job-105',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    title: 'Data & Machine Learning Engineer (LLMs & Search)',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    type: 'FULL_TIME',
    status: 'PUBLISHED',
    experienceLevel: 'MID',
    salaryMin: 155000,
    salaryMax: 185000,
    currency: 'USD',
    description: 'Implement semantic search algorithms, embeddings retrieval, and LLM fine-tuning pipelines for candidate-job matching.',
    requirements: [
      '3+ years building Python/PyTorch machine learning pipelines',
      'Hands-on experience with vector databases (Pinecone, pgvector) and embeddings',
      'Strong grasp of ML evaluation metrics and latency optimization'
    ],
    skills: ['Python', 'PyTorch', 'Vector DB', 'pgvector', 'FastAPI', 'Docker', 'NLP'],
    hiringManager: 'Dr. Aris Thorne, Lead AI Scientist',
    recruiterId: 'u-recruiter',
    recruiterName: 'Marcus Holloway',
    applicantsCount: 28,
    closingDate: '2026-12-31',
    createdAt: '2026-09-25',
    updatedAt: '2026-10-16'
  }
];

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    name: 'Alex Chen',
    email: 'alex.dev@gmail.com',
    phone: '+1 (555) 219-4832',
    location: 'San Francisco, CA',
    currentTitle: 'Senior Full Stack Architect',
    currentCompany: 'Stripe (Contract)',
    experienceYears: 7,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Go'],
    resumeUrl: '#',
    resumeName: 'Alex_Chen_Principal_FullStack_Resume_2026.pdf',
    rating: 5,
    tags: ['Top Tier', 'Culture Fit', 'Fast Learner', 'System Design Ace'],
    bio: 'Passionate software craftsman specialized in reactive frontend architecture and high-throughput microservices. Built scalable enterprise SaaS pipelines.',
    education: 'B.S. in Computer Science, UC Berkeley (2019)',
    createdAt: '2026-08-10'
  },
  {
    id: 'cand-002',
    name: 'Priya Sharma',
    email: 'priya.sharma.tech@outlook.com',
    phone: '+1 (555) 890-1234',
    location: 'Austin, TX',
    currentTitle: 'Staff DevOps & Cloud Engineer',
    currentCompany: 'Datadog',
    experienceYears: 8,
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker', 'Go', 'Prometheus'],
    resumeUrl: '#',
    resumeName: 'Priya_Sharma_Staff_DevOps_Resume.pdf',
    rating: 5,
    tags: ['Cloud Lead', 'Strong Communicator'],
    bio: 'DevOps lead specialized in AWS multi-region failover, Kubernetes multi-tenancy, and automated compliance policies.',
    education: 'M.S. in Software Engineering, UT Austin (2018)',
    createdAt: '2026-08-15'
  },
  {
    id: 'cand-003',
    name: 'Michael Brandon',
    email: 'mbrandon.product@gmail.com',
    phone: '+1 (555) 431-7788',
    location: 'New York, NY',
    currentTitle: 'Senior Product Manager',
    currentCompany: 'Notion',
    experienceYears: 6,
    skills: ['Product Strategy', 'User Research', 'Roadmapping', 'Agile', 'SQL', 'Figma'],
    resumeUrl: '#',
    resumeName: 'Michael_Brandon_Lead_PM_Resume.pdf',
    rating: 4,
    tags: ['Enterprise Mindset', 'Strategic'],
    bio: 'Product leader who scaled collaboration workflows to 5M+ active daily users.',
    education: 'B.A. in Economics & Design, Columbia University',
    createdAt: '2026-08-20'
  },
  {
    id: 'cand-004',
    name: 'Samantha Wright',
    email: 'swright.sales@innovate.co',
    phone: '+1 (555) 762-3390',
    location: 'Chicago, IL',
    currentTitle: 'Enterprise Account Executive',
    currentCompany: 'Salesforce',
    experienceYears: 7,
    skills: ['Enterprise SaaS', 'MEDDPICC', 'Salesforce', 'Negotiation', 'Executive Presentations'],
    resumeUrl: '#',
    resumeName: 'Samantha_Wright_Enterprise_AE.pdf',
    rating: 5,
    tags: ['Top Closer', 'Exceeded Quota 160%'],
    bio: 'Top 1% quota achiever for 4 consecutive years closing strategic $500k+ ACV contracts in FinTech.',
    education: 'B.S. in Business Administration, Northwestern University',
    createdAt: '2026-08-22'
  },
  {
    id: 'cand-005',
    name: 'Devin Kapoor',
    email: 'devin.ml.kapoor@gmail.com',
    phone: '+1 (555) 543-9182',
    location: 'San Jose, CA',
    currentTitle: 'Senior Machine Learning Specialist',
    currentCompany: 'Anthropic Research Partner',
    experienceYears: 5,
    skills: ['Python', 'PyTorch', 'Vector DB', 'pgvector', 'FastAPI', 'NLP', 'LangChain'],
    resumeUrl: '#',
    resumeName: 'Devin_Kapoor_ML_Engineer.pdf',
    rating: 4,
    tags: ['AI/ML Expert', 'Strong Math'],
    bio: 'Published author in NLP semantic embeddings with hands-on enterprise deployment experience.',
    education: 'Ph.D. Candidate in CS, Stanford University',
    createdAt: '2026-08-28'
  }
];

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-501',
    jobId: 'job-101',
    jobTitle: 'Senior Full Stack Engineer (React & Go/Java)',
    jobDepartment: 'Engineering',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    candidateId: 'cand-001',
    candidateName: 'Alex Chen',
    candidateEmail: 'alex.dev@gmail.com',
    candidatePhone: '+1 (555) 219-4832',
    candidateTitle: 'Senior Full Stack Architect',
    candidateLocation: 'San Francisco, CA',
    candidateExperienceYears: 7,
    candidateSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
    matchScore: 96,
    stage: 'OFFER_SENT',
    appliedDate: '2026-09-12',
    stageUpdatedAt: '2026-10-18',
    recruiterNotes: 'Exceptional system design walkthrough. Scored perfect 5/5 in tech assessment. Official offer sent for $185,000 + 0.15% equity.',
    rating: 5,
    resumeName: 'Alex_Chen_Principal_FullStack_Resume_2026.pdf',
    stageHistory: [
      { stage: 'APPLIED', timestamp: '2026-09-12 10:14', actorName: 'Alex Chen (Direct Application)' },
      { stage: 'SCREENING', timestamp: '2026-09-14 11:30', actorName: 'Marcus Holloway', notes: 'Resume verified. High match score (96%).' },
      { stage: 'SHORTLISTED', timestamp: '2026-09-16 14:00', actorName: 'Marcus Holloway', notes: 'Forwarded to Hiring Manager David K.' },
      { stage: 'INTERVIEW_SCHEDULED', timestamp: '2026-09-20 09:00', actorName: 'Marcus Holloway', notes: 'Scheduled Technical Architecture round.' },
      { stage: 'INTERVIEW_COMPLETED', timestamp: '2026-09-25 16:30', actorName: 'David K.', notes: 'Outstanding feedback from interview panel.' },
      { stage: 'OFFER_PENDING', timestamp: '2026-10-05 10:00', actorName: 'Sarah Jenkins', notes: 'Executive compensation approval confirmed.' },
      { stage: 'OFFER_SENT', timestamp: '2026-10-18 15:45', actorName: 'Marcus Holloway', notes: 'Formal letter generated and emailed.' }
    ]
  },
  {
    id: 'app-502',
    jobId: 'job-102',
    jobTitle: 'Staff Cloud Infrastructure Architect (K8s & AWS)',
    jobDepartment: 'Engineering',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    candidateId: 'cand-002',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma.tech@outlook.com',
    candidatePhone: '+1 (555) 890-1234',
    candidateTitle: 'Staff DevOps & Cloud Engineer',
    candidateLocation: 'Austin, TX',
    candidateExperienceYears: 8,
    candidateSkills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Prometheus'],
    matchScore: 94,
    stage: 'INTERVIEW_SCHEDULED',
    appliedDate: '2026-09-18',
    stageUpdatedAt: '2026-10-19',
    recruiterNotes: 'Round 2 scheduled with VP of Infrastructure for tomorrow 2:00 PM EST.',
    rating: 5,
    resumeName: 'Priya_Sharma_Staff_DevOps_Resume.pdf',
    stageHistory: [
      { stage: 'APPLIED', timestamp: '2026-09-18 14:20', actorName: 'Priya Sharma' },
      { stage: 'SCREENING', timestamp: '2026-09-20 10:15', actorName: 'Marcus Holloway' },
      { stage: 'SHORTLISTED', timestamp: '2026-09-24 16:00', actorName: 'Marcus Holloway' },
      { stage: 'INTERVIEW_SCHEDULED', timestamp: '2026-10-19 11:00', actorName: 'Marcus Holloway', notes: 'Confirmed interview session with Evelyn Reed.' }
    ]
  },
  {
    id: 'app-503',
    jobId: 'job-103',
    jobTitle: 'Principal Product Manager — Enterprise Workflow',
    jobDepartment: 'Product & Design',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    candidateId: 'cand-003',
    candidateName: 'Michael Brandon',
    candidateEmail: 'mbrandon.product@gmail.com',
    candidatePhone: '+1 (555) 431-7788',
    candidateTitle: 'Senior Product Manager',
    candidateLocation: 'New York, NY',
    candidateExperienceYears: 6,
    candidateSkills: ['Product Strategy', 'User Research', 'Roadmapping', 'SQL'],
    matchScore: 89,
    stage: 'SHORTLISTED',
    appliedDate: '2026-09-22',
    stageUpdatedAt: '2026-10-14',
    recruiterNotes: 'Case study review in progress. Impressive Notion product experience.',
    rating: 4,
    resumeName: 'Michael_Brandon_Lead_PM_Resume.pdf',
    stageHistory: [
      { stage: 'APPLIED', timestamp: '2026-09-22 09:30', actorName: 'Michael Brandon' },
      { stage: 'SCREENING', timestamp: '2026-09-26 15:00', actorName: 'Marcus Holloway' },
      { stage: 'SHORTLISTED', timestamp: '2026-10-14 11:20', actorName: 'Marcus Holloway', notes: 'Shortlisted for VP Product interview' }
    ]
  },
  {
    id: 'app-504',
    jobId: 'job-104',
    jobTitle: 'Senior Enterprise Account Executive (FinTech & Tech)',
    jobDepartment: 'Sales & RevOps',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    candidateId: 'cand-004',
    candidateName: 'Samantha Wright',
    candidateEmail: 'swright.sales@innovate.co',
    candidatePhone: '+1 (555) 762-3390',
    candidateTitle: 'Enterprise Account Executive',
    candidateLocation: 'Chicago, IL',
    candidateExperienceYears: 7,
    candidateSkills: ['Enterprise SaaS', 'MEDDPICC', 'Salesforce', 'Negotiation'],
    matchScore: 92,
    stage: 'HIRED',
    appliedDate: '2026-08-25',
    stageUpdatedAt: '2026-10-10',
    recruiterNotes: 'Offer accepted! Starts on Nov 3rd, 2026. Background check and I-9 completed.',
    rating: 5,
    resumeName: 'Samantha_Wright_Enterprise_AE.pdf',
    stageHistory: [
      { stage: 'APPLIED', timestamp: '2026-08-25 11:00', actorName: 'Samantha Wright' },
      { stage: 'SCREENING', timestamp: '2026-08-28 14:00', actorName: 'Marcus Holloway' },
      { stage: 'SHORTLISTED', timestamp: '2026-09-02 16:00', actorName: 'Marcus Holloway' },
      { stage: 'INTERVIEW_SCHEDULED', timestamp: '2026-09-08 10:00', actorName: 'Marcus Holloway' },
      { stage: 'INTERVIEW_COMPLETED', timestamp: '2026-09-15 17:00', actorName: 'Mark Thorne (CRO)' },
      { stage: 'OFFER_SENT', timestamp: '2026-09-28 11:00', actorName: 'Sarah Jenkins' },
      { stage: 'OFFER_ACCEPTED', timestamp: '2026-10-02 14:30', actorName: 'Samantha Wright' },
      { stage: 'HIRED', timestamp: '2026-10-10 09:00', actorName: 'Sarah Jenkins', notes: 'Candidate finalized into HRIS.' }
    ]
  },
  {
    id: 'app-505',
    jobId: 'job-105',
    jobTitle: 'Data & Machine Learning Engineer (LLMs & Search)',
    jobDepartment: 'Engineering',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    candidateId: 'cand-005',
    candidateName: 'Devin Kapoor',
    candidateEmail: 'devin.ml.kapoor@gmail.com',
    candidatePhone: '+1 (555) 543-9182',
    candidateTitle: 'Senior Machine Learning Specialist',
    candidateLocation: 'San Jose, CA',
    candidateExperienceYears: 5,
    candidateSkills: ['Python', 'PyTorch', 'Vector DB', 'pgvector', 'FastAPI'],
    matchScore: 88,
    stage: 'SCREENING',
    appliedDate: '2026-10-10',
    stageUpdatedAt: '2026-10-16',
    recruiterNotes: 'Reviewing recent arXiv papers on embeddings search. Ready for phone screen.',
    rating: 4,
    resumeName: 'Devin_Kapoor_ML_Engineer.pdf',
    stageHistory: [
      { stage: 'APPLIED', timestamp: '2026-10-10 18:20', actorName: 'Devin Kapoor' },
      { stage: 'SCREENING', timestamp: '2026-10-16 11:00', actorName: 'Marcus Holloway' }
    ]
  }
];

export const SEED_INTERVIEWS: Interview[] = [
  {
    id: 'intv-801',
    applicationId: 'app-502',
    candidateId: 'cand-002',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma.tech@outlook.com',
    jobId: 'job-102',
    jobTitle: 'Staff Cloud Infrastructure Architect (K8s & AWS)',
    organizationId: 'org-acme',
    roundName: 'Round 2: Cloud Systems & Terraform Live Design',
    roundNumber: 2,
    type: 'VIDEO',
    scheduledAt: '2026-10-22T14:00:00Z',
    durationMinutes: 60,
    interviewers: ['Evelyn Reed (VP Infrastructure)', 'Marcus Holloway (Talent)'],
    meetingUrl: 'https://meet.google.com/hfw-arch-982',
    status: 'SCHEDULED'
  },
  {
    id: 'intv-802',
    applicationId: 'app-501',
    candidateId: 'cand-001',
    candidateName: 'Alex Chen',
    candidateEmail: 'alex.dev@gmail.com',
    jobId: 'job-101',
    jobTitle: 'Senior Full Stack Engineer (React & Go/Java)',
    organizationId: 'org-acme',
    roundName: 'Round 3: Executive Leadership & Culture Alignment',
    roundNumber: 3,
    type: 'VIDEO',
    scheduledAt: '2026-09-25T15:30:00Z',
    durationMinutes: 45,
    interviewers: ['David K. (Director)', 'Sarah Jenkins (VP Talent)'],
    meetingUrl: 'https://meet.google.com/acm-lead-114',
    status: 'COMPLETED',
    feedbackScore: 5,
    feedbackNotes: 'Exemplary culture fit and technical gravitas. Strong recommendation to make an offer immediately.'
  }
];

export const SEED_OFFERS: Offer[] = [
  {
    id: 'off-901',
    applicationId: 'app-501',
    jobId: 'job-101',
    jobTitle: 'Senior Full Stack Engineer (React & Go/Java)',
    candidateId: 'cand-001',
    candidateName: 'Alex Chen',
    candidateEmail: 'alex.dev@gmail.com',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    baseSalary: 185000,
    bonus: 25000,
    equity: '0.15% Stock Options (4-year vesting, 1-year cliff)',
    currency: 'USD',
    startDate: '2026-11-15',
    expirationDate: '2026-11-01',
    status: 'SENT',
    notes: 'Includes comprehensive healthcare, $3,000 home office stipend, and flexible remote work.',
    sentAt: '2026-10-18T15:45:00Z'
  }
];

export const SEED_AGENCY_CLIENTS: AgencyClient[] = [
  {
    id: 'ac-1',
    agencyId: 'org-globalstaff',
    clientOrgId: 'org-acme',
    clientOrgName: 'Acme Technologies Inc.',
    contactPerson: 'Sarah Jenkins (VP Talent)',
    contactEmail: 'sarah.admin@acmecorp.com',
    activeRequisitionsCount: 4,
    commissionRatePercent: 20,
    status: 'ACTIVE'
  },
  {
    id: 'ac-2',
    agencyId: 'org-globalstaff',
    clientOrgId: 'org-technova',
    clientOrgName: 'TechNova Cloud Systems',
    contactPerson: 'Jason Vance (Director HR)',
    contactEmail: 'jason.hr@technova.io',
    activeRequisitionsCount: 2,
    commissionRatePercent: 18,
    status: 'ACTIVE'
  }
];

export const SEED_CANDIDATE_SUBMISSIONS: CandidateSubmission[] = [
  {
    id: 'sub-301',
    agencyId: 'org-globalstaff',
    agencyName: 'GlobalStaff Partners Agency',
    clientOrgId: 'org-acme',
    clientOrgName: 'Acme Technologies Inc.',
    jobId: 'job-101',
    jobTitle: 'Senior Full Stack Engineer (React & Go/Java)',
    candidateId: 'cand-001',
    candidateName: 'Alex Chen',
    candidateEmail: 'alex.dev@gmail.com',
    status: 'OFFERED',
    submittedAt: '2026-09-10',
    clientFeedback: 'Client is extremely pleased with candidate technical depth.',
    commissionEarned: 37000
  },
  {
    id: 'sub-302',
    agencyId: 'org-globalstaff',
    agencyName: 'GlobalStaff Partners Agency',
    clientOrgId: 'org-technova',
    clientOrgName: 'TechNova Cloud Systems',
    jobId: 'job-102',
    jobTitle: 'Staff Cloud Infrastructure Architect (K8s & AWS)',
    candidateId: 'cand-002',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma.tech@outlook.com',
    status: 'CLIENT_INTERVIEW',
    submittedAt: '2026-09-17',
    clientFeedback: 'Client scheduled round 2 interview.'
  }
];

export const SEED_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'TKT-2026-1049',
    userId: 'u-recruiter',
    userName: 'Marcus Holloway',
    userEmail: 'marcus.recruiter@acmecorp.com',
    userRole: 'RECRUITER',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    category: 'INTERVIEW_SCHEDULING',
    affectedModule: 'INTERVIEWS',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    queue: 'RECRUITMENT_OPS_SUPPORT',
    assignedAgentId: 'u-support-agent',
    assignedAgentName: 'Jordan Miller',
    subject: 'Time-zone calendar discrepancy detected in multi-interviewer round',
    description: 'When scheduling interview with European panellists, the Google Meet ICS calendar attachment displayed UTC rather than EDT, causing candidate confusion.',
    attachmentName: 'calendar_invite_screenshot.png',
    slaDueHours: 4,
    createdAt: '2026-10-20T09:15:00Z',
    firstResponseAt: '2026-10-20T09:42:00Z',
    messages: [
      {
        id: 'msg-1',
        ticketId: 'tkt-001',
        senderId: 'u-recruiter',
        senderName: 'Marcus Holloway',
        senderRole: 'RECRUITER',
        isInternalNote: false,
        content: 'Candidate notified me that the calendar invitation sent at 14:00 BST showed up as 09:00 EDT in their outlook client. Please verify time-zone localization header in HireFlow scheduling engine.',
        timestamp: '2026-10-20T09:15:00Z'
      },
      {
        id: 'msg-2',
        ticketId: 'tkt-001',
        senderId: 'u-support-agent',
        senderName: 'Jordan Miller',
        senderRole: 'SUPPORT_AGENT',
        isInternalNote: true,
        content: '[INTERNAL NOTE - STAFF ONLY] Investigated server log: ICS serialization library had fallback default to UTC when browser offset string is undefined. Patching timezone parser in core service.',
        timestamp: '2026-10-20T09:35:00Z'
      },
      {
        id: 'msg-3',
        ticketId: 'tkt-001',
        senderId: 'u-support-agent',
        senderName: 'Jordan Miller',
        senderRole: 'SUPPORT_AGENT',
        isInternalNote: false,
        content: 'Hello Marcus, our engineering team has reproduced the calendar localization issue and pushed an operational fix to the invitation generator. Future invitations will explicitly anchor to the candidate device local timezone. Please let us know if the issue persists on the next schedule.',
        timestamp: '2026-10-20T09:42:00Z'
      }
    ],
    statusHistory: [
      { status: 'OPEN', actor: 'Marcus Holloway', timestamp: '2026-10-20T09:15:00Z' },
      { status: 'TRIAGED', actor: 'Automated Routing Engine', timestamp: '2026-10-20T09:15:01Z', reason: 'Rule: Category INTERVIEW_SCHEDULING -> Queue RECRUITMENT_OPS_SUPPORT' },
      { status: 'ASSIGNED', actor: 'Victoria Stirling (Manager)', timestamp: '2026-10-20T09:20:00Z', reason: 'Assigned to Jordan Miller' },
      { status: 'IN_PROGRESS', actor: 'Jordan Miller', timestamp: '2026-10-20T09:35:00Z' }
    ]
  },
  {
    id: 'tkt-002',
    ticketNumber: 'TKT-2026-2184',
    userId: 'u-candidate',
    userName: 'Alex Chen',
    userEmail: 'alex.dev@gmail.com',
    userRole: 'CANDIDATE',
    organizationId: 'org-candidate',
    organizationName: 'Individual Candidate',
    category: 'CANDIDATE_APPLICATION',
    affectedModule: 'PORTAL',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    queue: 'CANDIDATE_SUPPORT',
    assignedAgentId: 'u-support-agent',
    assignedAgentName: 'Jordan Miller',
    subject: 'Request to update portfolio link on submitted application app-501',
    description: 'I recently published a new cloud architecture case study on GitHub and would like to attach it to my existing Senior Full Stack Engineer application.',
    slaDueHours: 8,
    createdAt: '2026-10-18T11:00:00Z',
    firstResponseAt: '2026-10-18T11:25:00Z',
    resolvedAt: '2026-10-18T12:00:00Z',
    messages: [
      {
        id: 'msg-201',
        ticketId: 'tkt-002',
        senderId: 'u-candidate',
        senderName: 'Alex Chen',
        senderRole: 'CANDIDATE',
        isInternalNote: false,
        content: 'Hi support team, could you please link my latest portfolio https://github.com/alexchen-cloud to my application for Acme Corp? Thank you!',
        timestamp: '2026-10-18T11:00:00Z'
      },
      {
        id: 'msg-202',
        ticketId: 'tkt-002',
        senderId: 'u-support-agent',
        senderName: 'Jordan Miller',
        senderRole: 'SUPPORT_AGENT',
        isInternalNote: false,
        content: 'Hi Alex! We have added your updated portfolio link directly to your candidate profile and notified recruiter Marcus Holloway. You can now see it reflected on your dashboard.',
        timestamp: '2026-10-18T11:25:00Z'
      }
    ],
    statusHistory: [
      { status: 'OPEN', actor: 'Alex Chen', timestamp: '2026-10-18T11:00:00Z' },
      { status: 'TRIAGED', actor: 'Automated Routing Engine', timestamp: '2026-10-18T11:00:01Z' },
      { status: 'ASSIGNED', actor: 'Jordan Miller', timestamp: '2026-10-18T11:10:00Z' },
      { status: 'RESOLVED', actor: 'Jordan Miller', timestamp: '2026-10-18T12:00:00Z', reason: 'Portfolio link updated successfully.' }
    ]
  },
  {
    id: 'tkt-003',
    ticketNumber: 'TKT-2026-3402',
    userId: 'u-agency',
    userName: 'Elena Rostova',
    userEmail: 'elena.agency@globalstaff.com',
    userRole: 'STAFFING_AGENCY',
    organizationId: 'org-globalstaff',
    organizationName: 'GlobalStaff Partners Agency',
    category: 'AGENCY_SUBMISSION',
    affectedModule: 'AGENCIES',
    priority: 'HIGH',
    status: 'OPEN',
    queue: 'AGENCY_SUPPORT',
    subject: 'Client requisition placement commission invoice sync query',
    description: 'Placement fee calculation for Candidate Alex Chen ($37,000 at 20%) requires verification before month-end automated accounting batch export.',
    slaDueHours: 4,
    createdAt: '2026-10-21T08:30:00Z',
    messages: [
      {
        id: 'msg-301',
        ticketId: 'tkt-003',
        senderId: 'u-agency',
        senderName: 'Elena Rostova',
        senderRole: 'STAFFING_AGENCY',
        isInternalNote: false,
        content: 'Please verify that our agency commission of 20% on the $185,000 base offer for Alex Chen is correctly reconciled in the Acme Corp billing ledger.',
        timestamp: '2026-10-21T08:30:00Z'
      }
    ],
    statusHistory: [
      { status: 'OPEN', actor: 'Elena Rostova', timestamp: '2026-10-21T08:30:00Z' },
      { status: 'TRIAGED', actor: 'Automated Routing Engine', timestamp: '2026-10-21T08:30:01Z', reason: 'Rule: Category AGENCY_SUBMISSION -> Queue AGENCY_SUPPORT' }
    ]
  }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'u-candidate',
    title: 'Formal Offer Letter Sent!',
    message: 'Acme Technologies Inc. has sent you an official offer for Senior Full Stack Engineer ($185,000 + Equity). Review and respond.',
    type: 'OFFER',
    linkTab: 'candidate-offers',
    isRead: false,
    createdAt: '2026-10-18 15:45'
  },
  {
    id: 'notif-2',
    userId: 'u-recruiter',
    title: 'New Candidate Application',
    message: 'Alex Chen applied for Senior Full Stack Engineer (96% skill match score).',
    type: 'APPLICATION',
    linkTab: 'recruiter-pipeline',
    isRead: true,
    createdAt: '2026-09-12 10:15'
  },
  {
    id: 'notif-3',
    userId: 'u-recruiter',
    title: 'Support Ticket Update',
    message: 'Jordan Miller replied to ticket TKT-2026-1049: "Operational fix pushed to invitation generator."',
    type: 'SUPPORT',
    linkTab: 'help-support',
    isRead: false,
    createdAt: '2026-10-20 09:42'
  },
  {
    id: 'notif-4',
    userId: 'u-support-agent',
    title: 'New Ticket In Assigned Queue',
    message: 'Ticket TKT-2026-3402 assigned to Agency Support queue. High priority SLA: 4 hours.',
    type: 'SUPPORT',
    linkTab: 'support-agent',
    isRead: false,
    createdAt: '2026-10-21 08:30'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    userId: 'u-orgadmin',
    userName: 'Sarah Jenkins',
    userRole: 'ORG_ADMIN',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    action: 'OFFER_APPROVAL',
    entity: 'Offer #off-901',
    details: 'Approved executive compensation package for Alex Chen ($185,000)',
    timestamp: '2026-10-18 15:30:12',
    ipAddress: '198.51.100.44'
  },
  {
    id: 'aud-2',
    userId: 'u-recruiter',
    userName: 'Marcus Holloway',
    userRole: 'RECRUITER',
    organizationId: 'org-acme',
    organizationName: 'Acme Technologies Inc.',
    action: 'STAGE_ADVANCEMENT',
    entity: 'Application #app-501',
    details: 'Advanced candidate Alex Chen from INTERVIEW_COMPLETED to OFFER_PENDING',
    timestamp: '2026-10-05 10:00:45',
    ipAddress: '198.51.100.12'
  },
  {
    id: 'aud-3',
    userId: 'u-superadmin',
    userName: 'Alexander Vance',
    userRole: 'SUPER_ADMIN',
    organizationId: 'org-platform',
    organizationName: 'HireFlow Platform Global',
    action: 'TENANT_TIER_UPDATE',
    entity: 'Organization #org-acme',
    details: 'Upgraded tenant Acme Technologies Inc. to ENTERPRISE tier with unlimited ATS pipeline seats',
    timestamp: '2026-09-01 08:15:00',
    ipAddress: '10.0.0.1 (Internal Gateway)'
  }
];
