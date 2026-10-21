import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';

export const JobsDirectoryPage: React.FC = () => {
  const { jobs, applications, applyToJob, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  // Apply Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [resumeName, setResumeName] = useState(`${currentUser.name.replace(' ', '_')}_Resume_2026.pdf`);
  const [msg, setMsg] = useState<string | null>(null);

  const filteredJobs = jobs.filter(j => {
    if (j.status !== 'PUBLISHED') return false;
    if (deptFilter !== 'ALL' && j.department !== deptFilter) return false;
    const q = searchTerm.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.organizationName.toLowerCase().includes(q) ||
      j.skills.some(s => s.toLowerCase().includes(q))
    );
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    const res = applyToJob(
      selectedJobForApply.id,
      {
        name,
        email,
        phone,
        currentTitle: 'Applicant',
        skills: selectedJobForApply.skills
      },
      resumeName
    );

    if (res.success) {
      setMsg(`Application submitted for ${selectedJobForApply.title}!`);
      setSelectedJobForApply(null);
      setTimeout(() => setMsg(null), 4000);
    } else {
      setMsg(res.error || 'Failed to submit application.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Public Requisitions Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global repository of active requisitions across all certified partner organizations and clients.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search requisition title, company, skills..."
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map(job => {
          const applied = applications.some(a => a.jobId === job.id && a.candidateEmail === currentUser.email);
          return (
            <div
              key={job.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {job.organizationName}
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
                  <span className="font-mono font-bold text-slate-700">
                    ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map(sk => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{job.applicantsCount} applicants</span>

                {applied ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedJobForApply(job)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* APPLY MODAL */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedJobForApply.title}</h3>
                <p className="text-xs text-slate-500">{selectedJobForApply.organizationName}</p>
              </div>
              <button onClick={() => setSelectedJobForApply(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Attached Resume</label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-slate-700 font-bold truncate">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{resumeName}</span>
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
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
