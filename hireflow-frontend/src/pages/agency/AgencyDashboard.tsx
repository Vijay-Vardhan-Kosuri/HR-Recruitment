import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, CandidateSubmission } from '../../types';
import {
  Send,
  Building,
  Users,
  Gift,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  Search,
  ExternalLink,
  X
} from 'lucide-react';

export const AgencyDashboard: React.FC = () => {
  const {
    currentUser,
    agencyClients,
    jobs,
    candidateSubmissions,
    submitAgencyCandidate
  } = useApp();

  const [selectedJobForSubmit, setSelectedJobForSubmit] = useState<Job | null>(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateCompensation, setCandidateCompensation] = useState('180,000');
  const [candidateNotes, setCandidateNotes] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const totalCommissionsEarned = candidateSubmissions
    .filter(s => s.status === 'PLACED' && s.commissionEarned)
    .reduce((acc, s) => acc + (s.commissionEarned || 0), 0);

  const handleSubmitCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForSubmit || !candidateName.trim() || !candidateEmail.trim()) return;

    submitAgencyCandidate({
      agencyId: currentUser.organizationId,
      agencyName: currentUser.organizationName,
      clientOrgId: selectedJobForSubmit.organizationId,
      clientOrgName: selectedJobForSubmit.organizationName,
      jobId: selectedJobForSubmit.id,
      jobTitle: selectedJobForSubmit.title,
      candidateId: `cand-ag-${Date.now()}`,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      clientFeedback: candidateNotes || 'Candidate submitted via GlobalStaff Partners Agency portal.'
    });

    setSubmitSuccess(`Candidate ${candidateName} submitted to ${selectedJobForSubmit.organizationName} for "${selectedJobForSubmit.title}"!`);
    setSelectedJobForSubmit(null);
    setCandidateName('');
    setCandidateEmail('');
    setCandidateNotes('');
    setTimeout(() => setSubmitSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staffing Agency Partner Command</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-900 border border-teal-200">
              Agency Lead
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submit top talent to client requisitions, track candidate review stages, and manage placement commission earnings.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-teal-100 border border-teal-300 text-teal-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Client Accounts</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{agencyClients.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Retained enterprise contracts</div>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Talent Submissions</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">{candidateSubmissions.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Active candidates proposed</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Successful Placements</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
              {candidateSubmissions.filter(s => s.status === 'PLACED').length || 1}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Hired by client firms</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Commissions Realized</span>
            <div className="text-2xl font-black text-teal-700 font-mono mt-1">
              ${(totalCommissionsEarned || 37000).toLocaleString()}
            </div>
            <div className="text-[10px] text-teal-700 font-semibold mt-0.5">Standard 20% placement fee</div>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 text-teal-700">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Client Companies & Active Mandates */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Authorized Client Company Mandates</h3>
            <p className="text-xs text-slate-500">Companies partnering with your agency for specialized sourcing.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agencyClients.map(c => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{c.clientOrgName}</h4>
                  <div className="text-[11px] text-slate-500">Contact: {c.contactPerson} ({c.contactEmail})</div>
                </div>
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                  {c.commissionRatePercent}% Fee
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/80">
                <span className="text-slate-500 font-medium">{c.activeRequisitionsCount} open requisitions authorized</span>
                <span className="font-bold text-emerald-700">Contract Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Client Requisitions to Submit Candidates */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Open Requisitions for Talent Submission</h3>
            <p className="text-xs text-slate-500">Submit pre-screened talent directly into client ATS pipelines.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Client Organization</th>
                <th className="py-3 px-4">Position Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Target Compensation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-bold text-slate-900">{job.organizationName}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{job.title}</div>
                    <div className="text-[10px] text-slate-400">{job.department}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{job.location}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedJobForSubmit(job)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Talent</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Submissions Tracker */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Agency Submission Funnel Tracker</h3>
            <p className="text-xs text-slate-500">Live progress of all candidates submitted to client hiring teams.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Client & Requisition</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Client Review Status</th>
                <th className="py-3 px-4">Placement Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidateSubmissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{sub.candidateName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{sub.candidateEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{sub.jobTitle}</div>
                    <div className="text-[10px] text-slate-400">{sub.clientOrgName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{sub.submittedAt}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        sub.status === 'PLACED'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : sub.status === 'OFFERED'
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-teal-50 text-teal-900 border border-teal-200'
                      }`}
                    >
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {sub.commissionEarned ? `$${sub.commissionEarned.toLocaleString()}` : 'Pending Placement'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBMIT TALENT MODAL */}
      {selectedJobForSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Submit Talent to Client</h3>
                <p className="text-xs text-slate-500">{selectedJobForSubmit.title} @ {selectedJobForSubmit.organizationName}</p>
              </div>
              <button onClick={() => setSelectedJobForSubmit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCandidate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Legal Name *</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value)}
                  placeholder="e.g. Liam Montgomery"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Candidate Email *</label>
                <input
                  type="email"
                  required
                  value={candidateEmail}
                  onChange={e => setCandidateEmail(e.target.value)}
                  placeholder="e.g. liam.montgomery@devmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Target Base Expectation ($)</label>
                <input
                  type="text"
                  value={candidateCompensation}
                  onChange={e => setCandidateCompensation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Agency Recruiter Endorsement</label>
                <textarea
                  rows={3}
                  value={candidateNotes}
                  onChange={e => setCandidateNotes(e.target.value)}
                  placeholder="Brief summary of candidate technical strengths, notice period, and culture fit..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJobForSubmit(null)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
