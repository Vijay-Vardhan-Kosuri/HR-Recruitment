import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStage, Job } from '../../types';
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Search,
  Filter,
  Users,
  Briefcase,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Calendar,
  Gift,
  FileText,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const {
    currentUser,
    activeOrg,
    jobs,
    applications,
    advanceApplicationStage,
    rejectApplication,
    rateCandidate,
    scheduleInterview,
    createOffer,
    sendOffer,
    createJob
  } = useApp();

  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<Application | null>(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  const [selectedAppForOffer, setSelectedAppForOffer] = useState<Application | null>(null);

  // New Job Form State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Engineering');
  const [newJobLoc, setNewJobLoc] = useState('Remote');
  const [newJobType, setNewJobType] = useState<Job['type']>('FULL_TIME');
  const [newJobMin, setNewJobMin] = useState(140000);
  const [newJobMax, setNewJobMax] = useState(180000);
  const [newJobSkills, setNewJobSkills] = useState('React, TypeScript, Node.js, PostgreSQL');

  // Interview Schedule Form State
  const [intvRoundName, setIntvRoundName] = useState('Round 2: Technical Architecture Deep-Dive');
  const [intvDateTime, setIntvDateTime] = useState('2026-10-25T14:00');
  const [intvDuration, setIntvDuration] = useState(60);
  const [intvInterviewers, setIntvInterviewers] = useState('David K. (Director), Marcus Holloway');
  const [intvError, setIntvError] = useState<string | null>(null);

  // Offer Form State
  const [offerBase, setOfferBase] = useState(175000);
  const [offerBonus, setOfferBonus] = useState(20000);
  const [offerEquity, setOfferEquity] = useState('0.10% Stock Options (4-year vesting)');
  const [offerStartDate, setOfferStartDate] = useState('2026-11-15');

  // Filter applications
  const filteredApps = applications.filter(app => {
    // Org filter
    if (activeOrg.id !== 'org-platform' && app.organizationId !== activeOrg.id) return false;
    // Job filter
    if (selectedJobId !== 'ALL' && app.jobId !== selectedJobId) return false;
    // Search
    const search = searchTerm.toLowerCase();
    return (
      app.candidateName.toLowerCase().includes(search) ||
      app.jobTitle.toLowerCase().includes(search) ||
      app.candidateSkills.some(s => s.toLowerCase().includes(search))
    );
  });

  const stagesList: { stage: ApplicationStage; title: string; color: string; badgeBg: string }[] = [
    { stage: 'APPLIED', title: 'Applied', color: 'border-slate-300', badgeBg: 'bg-slate-100 text-slate-800' },
    { stage: 'SCREENING', title: 'Screening', color: 'border-blue-300', badgeBg: 'bg-blue-100 text-blue-900' },
    { stage: 'SHORTLISTED', title: 'Shortlisted', color: 'border-indigo-300', badgeBg: 'bg-indigo-100 text-indigo-900' },
    { stage: 'INTERVIEW_SCHEDULED', title: 'Interview Scheduled', color: 'border-amber-300', badgeBg: 'bg-amber-100 text-amber-900' },
    { stage: 'INTERVIEW_COMPLETED', title: 'Interview Done', color: 'border-purple-300', badgeBg: 'bg-purple-100 text-purple-900' },
    { stage: 'OFFER_SENT', title: 'Offer Sent', color: 'border-emerald-300', badgeBg: 'bg-emerald-100 text-emerald-950' },
    { stage: 'HIRED', title: 'Hired', color: 'border-emerald-500', badgeBg: 'bg-emerald-600 text-white' }
  ];

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    createJob({
      title: newJobTitle.trim(),
      department: newJobDept,
      location: newJobLoc,
      type: newJobType,
      salaryMin: Number(newJobMin),
      salaryMax: Number(newJobMax),
      skills: newJobSkills.split(',').map(s => s.trim()).filter(Boolean)
    });

    setShowCreateJobModal(false);
    setNewJobTitle('');
  };

  const handleScheduleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    const res = scheduleInterview({
      applicationId: selectedAppForInterview.id,
      candidateId: selectedAppForInterview.candidateId,
      candidateName: selectedAppForInterview.candidateName,
      candidateEmail: selectedAppForInterview.candidateEmail,
      jobId: selectedAppForInterview.jobId,
      jobTitle: selectedAppForInterview.jobTitle,
      organizationId: selectedAppForInterview.organizationId,
      roundName: intvRoundName,
      roundNumber: 2,
      type: 'VIDEO',
      scheduledAt: new Date(intvDateTime).toISOString(),
      durationMinutes: Number(intvDuration),
      interviewers: intvInterviewers.split(',').map(s => s.trim()),
      meetingUrl: `https://meet.google.com/hfw-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`
    });

    if (!res.success) {
      setIntvError(res.error || 'Failed to schedule');
    } else {
      setIntvError(null);
      setSelectedAppForInterview(null);
    }
  };

  const handleCreateOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForOffer) return;

    const created = createOffer({
      applicationId: selectedAppForOffer.id,
      jobId: selectedAppForOffer.jobId,
      jobTitle: selectedAppForOffer.jobTitle,
      candidateId: selectedAppForOffer.candidateId,
      candidateName: selectedAppForOffer.candidateName,
      candidateEmail: selectedAppForOffer.candidateEmail,
      organizationId: selectedAppForOffer.organizationId,
      organizationName: selectedAppForOffer.organizationName,
      baseSalary: Number(offerBase),
      bonus: Number(offerBonus),
      equity: offerEquity,
      currency: 'USD',
      startDate: offerStartDate,
      expirationDate: '2026-11-15'
    });

    sendOffer(created.id);
    setSelectedAppForOffer(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recruitment Pipeline Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live ATS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Interactive multi-stage recruitment pipeline, candidate ratings, interview scheduling, and offer letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center rounded-xl border border-slate-300 p-1 bg-white">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'KANBAN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateJobModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Requisition</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search candidate name, job title, skills..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white"
          >
            <option value="ALL">All Requisitions ({jobs.length})</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'KANBAN' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 items-start overflow-x-auto pb-4">
          {stagesList.map(col => {
            const stageApps = filteredApps.filter(a => a.stage === col.stage);
            return (
              <div
                key={col.stage}
                className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3 min-w-[240px] space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="font-bold text-xs text-slate-900 truncate">{col.title}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.badgeBg}`}>
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5">
                  {stageApps.length === 0 ? (
                    <div className="py-6 text-center text-[11px] text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      No candidates
                    </div>
                  ) : (
                    stageApps.map(app => (
                      <div
                        key={app.id}
                        className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-2.5 text-xs"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <button
                              onClick={() => setSelectedAppForDetail(app)}
                              className="font-bold text-slate-900 hover:text-emerald-700 text-left line-clamp-1 cursor-pointer"
                            >
                              {app.candidateName}
                            </button>
                            <div className="text-[10px] text-slate-500 truncate">{app.candidateTitle}</div>
                          </div>
                          <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {app.matchScore}%
                          </span>
                        </div>

                        {/* Job Requisition */}
                        <div className="text-[11px] text-slate-600 font-medium line-clamp-1 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{app.jobTitle}</span>
                        </div>

                        {/* Rating stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => rateCandidate(app.candidateId, star)}
                              className="cursor-pointer"
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  star <= app.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300 hover:text-amber-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        {/* Stage Specific Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          {col.stage === 'APPLIED' && (
                            <button
                              onClick={() => advanceApplicationStage(app.id, 'SCREENING')}
                              className="w-full py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Screen</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          {col.stage === 'SCREENING' && (
                            <button
                              onClick={() => advanceApplicationStage(app.id, 'SHORTLISTED')}
                              className="w-full py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Shortlist</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          {col.stage === 'SHORTLISTED' && (
                            <button
                              onClick={() => setSelectedAppForInterview(app)}
                              className="w-full py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Schedule Round</span>
                            </button>
                          )}

                          {col.stage === 'INTERVIEW_SCHEDULED' && (
                            <button
                              onClick={() => advanceApplicationStage(app.id, 'INTERVIEW_COMPLETED', 'Interview completed with positive feedback')}
                              className="w-full py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Mark Evaluated</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          {col.stage === 'INTERVIEW_COMPLETED' && (
                            <button
                              onClick={() => setSelectedAppForOffer(app)}
                              className="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Gift className="w-3 h-3" />
                              <span>Generate Offer</span>
                            </button>
                          )}

                          {col.stage === 'OFFER_SENT' && (
                            <div className="w-full text-center text-[10px] text-emerald-700 font-bold bg-emerald-50 py-1 rounded-lg">
                              Awaiting Candidate Signature
                            </div>
                          )}

                          {col.stage === 'HIRED' && (
                            <div className="w-full text-center text-[10px] text-emerald-800 font-bold flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Onboarded</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Job Requisition</th>
                  <th className="py-3 px-4">Match</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.candidateName}</div>
                      <div className="text-[11px] text-slate-500">{app.candidateEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{app.jobTitle}</div>
                      <div className="text-[10px] text-slate-400">{app.jobDepartment}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{app.matchScore}%</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                        {app.stage.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= app.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{app.appliedDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedAppForDetail(app)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE REQUISITION MODAL */}
      {showCreateJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Publish New Job Requisition</h3>
              <button onClick={() => setShowCreateJobModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={e => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Architect (Node/Go)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                  <select
                    value={newJobDept}
                    onChange={e => setNewJobDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & RevOps">Sales & RevOps</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={newJobLoc}
                    onChange={e => setNewJobLoc(e.target.value)}
                    placeholder="e.g. San Francisco (Hybrid)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Min Salary ($)</label>
                  <input
                    type="number"
                    value={newJobMin}
                    onChange={e => setNewJobMin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Max Salary ($)</label>
                  <input
                    type="number"
                    value={newJobMax}
                    onChange={e => setNewJobMax(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newJobSkills}
                  onChange={e => setNewJobSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateJobModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {selectedAppForInterview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Interview Round</h3>
              <button onClick={() => setSelectedAppForInterview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {intvError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{intvError}</span>
              </div>
            )}

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{selectedAppForInterview.candidateName}</div>
                <div className="text-[11px] text-slate-500">{selectedAppForInterview.jobTitle}</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Round Name *</label>
                <input
                  type="text"
                  required
                  value={intvRoundName}
                  onChange={e => setIntvRoundName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={intvDateTime}
                    onChange={e => setIntvDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={intvDuration}
                    onChange={e => setIntvDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Interviewers</label>
                <input
                  type="text"
                  value={intvInterviewers}
                  onChange={e => setIntvInterviewers(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppForInterview(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE OFFER MODAL */}
      {selectedAppForOffer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Extend Formal Compensation Offer</h3>
              <button onClick={() => setSelectedAppForOffer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfferSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">{selectedAppForOffer.candidateName}</div>
                <div className="text-[11px] text-slate-500">{selectedAppForOffer.jobTitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Base Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={offerBase}
                    onChange={e => setOfferBase(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Target Bonus ($)</label>
                  <input
                    type="number"
                    value={offerBonus}
                    onChange={e => setOfferBonus(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Equity Grant Package</label>
                <input
                  type="text"
                  value={offerEquity}
                  onChange={e => setOfferEquity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Proposed Start Date</label>
                <input
                  type="date"
                  value={offerStartDate}
                  onChange={e => setOfferStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppForOffer(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-4 h-4" />
                  <span>Send Offer Letter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANDIDATE INSPECT DETAIL MODAL */}
      {selectedAppForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedAppForDetail.candidateName}</h3>
                <p className="text-[11px] text-slate-500">{selectedAppForDetail.jobTitle}</p>
              </div>
              <button onClick={() => setSelectedAppForDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Email & Phone</span>
                  <div className="font-bold text-slate-800">{selectedAppForDetail.candidateEmail}</div>
                  <div className="text-[11px] text-slate-500">{selectedAppForDetail.candidatePhone}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Match & Rating</span>
                  <div className="font-mono font-bold text-emerald-700">{selectedAppForDetail.matchScore}% Algorithm Match</div>
                  <div className="text-[11px] text-amber-600 font-bold">{selectedAppForDetail.rating} / 5 Stars</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Verified Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedAppForDetail.candidateSkills.map(sk => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Recruiter Evaluation Notes</span>
                <div className="mt-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedAppForDetail.recruiterNotes || 'No notes added yet.'}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Stage Audit Trail</span>
                <div className="mt-1 space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedAppForDetail.stageHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800">
                          {h.stage.replace(/_/g, ' ')} • <span className="font-mono text-slate-400 text-[10px]">{h.timestamp}</span>
                        </div>
                        <div className="text-slate-500">{h.notes || `Updated by ${h.actorName}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => {
                  rejectApplication(selectedAppForDetail.id);
                  setSelectedAppForDetail(null);
                }}
                className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-xl text-xs"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedAppForDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
