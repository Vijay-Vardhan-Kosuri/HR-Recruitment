import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, Application } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Gift,
  FileText,
  User,
  Clock,
  MapPin,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Upload,
  X,
  AlertCircle
} from 'lucide-react';

export const CandidatePortal: React.FC = () => {
  const {
    currentUser,
    jobs,
    applications,
    interviews,
    offers,
    applyToJob,
    respondToOffer,
    withdrawApplication,
    activeTab,
    setActiveTab,
    openHelpModal
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'JOBS' | 'APPLICATIONS' | 'INTERVIEWS' | 'OFFERS' | 'PROFILE'>(() => {
    if (activeTab === 'candidate-applications') return 'APPLICATIONS';
    if (activeTab === 'candidate-interviews') return 'INTERVIEWS';
    if (activeTab === 'candidate-offers') return 'OFFERS';
    if (activeTab === 'candidate-profile') return 'PROFILE';
    return 'JOBS';
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  // Apply Form State
  const [candName, setCandName] = useState(currentUser.name);
  const [candEmail, setCandEmail] = useState(currentUser.email);
  const [candPhone, setCandPhone] = useState('+1 (555) 219-4832');
  const [candResume, setCandResume] = useState('Alex_Chen_Principal_FullStack_Resume_2026.pdf');
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Offer Acceptance Celebration
  const [celebrationOfferId, setCelebrationOfferId] = useState<string | null>(null);

  const myApplications = applications.filter(
    a => a.candidateId === currentUser.id || a.candidateEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const myInterviews = interviews.filter(
    i => i.candidateId === currentUser.id || i.candidateEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const myOffers = offers.filter(
    o => o.candidateId === currentUser.id || o.candidateEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const filteredJobs = jobs.filter(j => {
    if (j.status !== 'PUBLISHED') return false;
    if (deptFilter !== 'ALL' && j.department !== deptFilter) return false;
    const q = searchTerm.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    const res = applyToJob(
      selectedJobForApply.id,
      {
        name: candName,
        email: candEmail,
        phone: candPhone,
        currentTitle: 'Senior Full Stack & Cloud Architect',
        experienceYears: 7,
        skills: selectedJobForApply.skills
      },
      candResume
    );

    if (res.success) {
      setApplySuccess(`Successfully applied for "${selectedJobForApply.title}"! Track stage progression below.`);
      setApplyError(null);
      setSelectedJobForApply(null);
      setActiveSubTab('APPLICATIONS');
      setTimeout(() => setApplySuccess(null), 5000);
    } else {
      setApplyError(res.error || 'Failed to submit application.');
    }
  };

  const handleOfferAction = (offerId: string, action: 'ACCEPTED' | 'DECLINED') => {
    respondToOffer(offerId, action);
    if (action === 'ACCEPTED') {
      setCelebrationOfferId(offerId);
      setTimeout(() => setCelebrationOfferId(null), 8000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Celebration Banner */}
      {celebrationOfferId && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex items-center justify-between gap-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold">Congratulations! Offer Accepted & Hired! 🎉</h3>
              <p className="text-xs text-emerald-100 mt-1">
                Your onboarding documentation and HRIS welcome kit have been initiated. Welcome to the team!
              </p>
            </div>
          </div>
          <button
            onClick={() => setCelebrationOfferId(null)}
            className="px-4 py-2 bg-white text-emerald-900 rounded-xl font-bold text-xs shadow-md"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Notification */}
      {applySuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{applySuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Candidate Career Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Welcome back, {currentUser.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Explore active high-impact career requisitions, track real-time hiring stage transitions, and manage compensation offers.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'JOBS', label: 'Explore Jobs', icon: Search, badge: filteredJobs.length },
            { id: 'APPLICATIONS', label: 'My Applications', icon: FileText, badge: myApplications.length },
            { id: 'INTERVIEWS', label: 'Interviews', icon: Calendar, badge: myInterviews.length },
            { id: 'OFFERS', label: 'Offers', icon: Gift, badge: myOffers.length, badgeColor: 'bg-emerald-500' },
            { id: 'PROFILE', label: 'My Profile', icon: User }
          ].map(t => {
            const Icon = t.icon;
            const isSel = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSel
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.badge !== undefined && t.badge > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${t.badgeColor || 'bg-slate-700'}`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB: EXPLORE JOBS */}
      {activeSubTab === 'JOBS' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search job title, location, skill tags..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Sales & RevOps">Sales & RevOps</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map(job => {
              const alreadyApplied = myApplications.some(a => a.jobId === job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                          {job.department} • {job.organizationName}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{job.title}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase shrink-0">
                        {job.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.map(sk => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {job.applicantsCount} applicants
                    </span>

                    {alreadyApplied ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedJobForApply(job)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>1-Click Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB: MY APPLICATIONS */}
      {activeSubTab === 'APPLICATIONS' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No applications yet</h3>
              <p className="text-xs text-slate-500">Explore open requisitions and submit an application.</p>
              <button
                onClick={() => setActiveSubTab('JOBS')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Roles
              </button>
            </div>
          ) : (
            myApplications.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {app.organizationName} • {app.jobDepartment}
                    </span>
                    <h3 className="text-base font-black text-slate-900">{app.jobTitle}</h3>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Applied on: {app.appliedDate}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      Match: {app.matchScore}%
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        app.stage === 'HIRED' || app.stage === 'OFFER_SENT' || app.stage === 'OFFER_ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : app.stage === 'REJECTED' || app.stage === 'WITHDRAWN'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}
                    >
                      Stage: {app.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Visual Stage Progress Timeline */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Application Lifecycle Progress
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {['APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED'].map((stName, idx) => {
                      const isReached =
                        idx === 0 ||
                        (idx === 1 && app.stage !== 'APPLIED') ||
                        (idx === 2 && !['APPLIED', 'SCREENING'].includes(app.stage)) ||
                        (idx === 3 && ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'OFFER_PENDING', 'OFFER_SENT', 'OFFER_ACCEPTED', 'HIRED'].includes(app.stage)) ||
                        (idx === 4 && ['OFFER_PENDING', 'OFFER_SENT', 'OFFER_ACCEPTED', 'HIRED'].includes(app.stage)) ||
                        (idx === 5 && ['OFFER_ACCEPTED', 'HIRED'].includes(app.stage));

                      return (
                        <div key={stName} className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              isReached
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {stName}
                          </span>
                          {idx < 5 && <span className="text-slate-300">&rarr;</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <div className="text-slate-500 text-[11px]">
                    Attached Resume: <span className="font-mono font-bold text-slate-700">{app.resumeName}</span>
                  </div>

                  {app.stage !== 'HIRED' && app.stage !== 'REJECTED' && app.stage !== 'WITHDRAWN' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to withdraw this application?')) {
                          withdrawApplication(app.id);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-TAB: INTERVIEWS */}
      {activeSubTab === 'INTERVIEWS' && (
        <div className="space-y-4">
          {myInterviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">No scheduled interviews</h3>
              <p className="text-xs text-slate-500 mt-1">
                When recruiters schedule an evaluation round, your video link and time will appear here.
              </p>
            </div>
          ) : (
            myInterviews.map(intv => (
              <div
                key={intv.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    {intv.jobTitle}
                  </span>
                  <h3 className="text-base font-black text-slate-900">{intv.roundName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{new Date(intv.scheduledAt).toLocaleString()} ({intv.durationMinutes} Mins)</span>
                    </span>
                    <span>• Panel: {intv.interviewers.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={intv.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Join Video Meeting</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-TAB: OFFERS */}
      {activeSubTab === 'OFFERS' && (
        <div className="space-y-4">
          {myOffers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Gift className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">No offer letters pending</h3>
              <p className="text-xs text-slate-500 mt-1">Formal offers extended by hiring teams will be displayed here.</p>
            </div>
          ) : (
            myOffers.map(off => (
              <div
                key={off.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      Official Employment Offer Letter
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-0.5">{off.jobTitle}</h2>
                    <div className="text-xs text-slate-500">{off.organizationName}</div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      off.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : off.status === 'DECLINED'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}
                  >
                    Status: {off.status}
                  </span>
                </div>

                {/* Compensation Package Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-900">Annual Base Salary</span>
                    <div className="text-2xl font-black text-emerald-950 font-mono mt-1">
                      ${off.baseSalary.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">Paid bi-weekly in USD</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-600">Annual Target Bonus</span>
                    <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                      ${off.bonus.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Performance-linked</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-600">Equity Stock Options</span>
                    <div className="text-base font-extrabold text-slate-900 mt-1">
                      {off.equity || '0.10% Equity'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">4-year standard vesting</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Employment Terms & Perks:</div>
                  <p>{off.notes || 'Includes comprehensive health benefits, flexible remote stipend, and 401(k) matching.'}</p>
                  <div className="text-[11px] text-slate-400 font-mono pt-1">
                    Proposed Start Date: {off.startDate}
                  </div>
                </div>

                {/* Action Buttons */}
                {off.status === 'SENT' && (
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleOfferAction(off.id, 'DECLINED')}
                      className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      Decline Offer
                    </button>
                    <button
                      onClick={() => handleOfferAction(off.id, 'ACCEPTED')}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept & Sign Offer</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-TAB: PROFILE */}
      {activeSubTab === 'PROFILE' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900">Candidate Profile & Professional Portfolio</h2>
            <p className="text-xs text-slate-500">Your profile details are automatically parsed for algorithmic role matching.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Full Legal Name</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Current Job Title</label>
              <input
                type="text"
                defaultValue="Senior Full Stack & Cloud Architect"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                defaultValue="San Francisco, CA"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1 text-xs">Primary Technical Skills</label>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Go', 'AWS', 'GraphQL', 'Tailwind CSS'].map(sk => (
                <span key={sk} className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Alex_Chen_Principal_FullStack_Resume_2026.pdf</div>
                <div className="text-[11px] text-slate-400 font-mono">Verified PDF • 2.4 MB • Uploaded 2026-09-12</div>
              </div>
            </div>

            <button
              onClick={() => alert('Resume replacement dialog simulated!')}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              Replace File
            </button>
          </div>
        </div>
      )}

      {/* 1-CLICK APPLY MODAL */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Apply for Position</h3>
                <p className="text-xs text-slate-500">{selectedJobForApply.title} @ {selectedJobForApply.organizationName}</p>
              </div>
              <button onClick={() => setSelectedJobForApply(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {applyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{applyError}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={e => setCandName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={e => setCandEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={candPhone}
                    onChange={e => setCandPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Attached Resume</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-slate-700 font-bold truncate">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{candResume}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Attached
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
