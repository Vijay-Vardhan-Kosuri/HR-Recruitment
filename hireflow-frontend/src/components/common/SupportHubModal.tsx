import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketCategory, TicketPriority, SupportQueue } from '../../types';
import {
  X,
  LifeBuoy,
  Send,
  AlertCircle,
  Clock,
  Sparkles,
  Paperclip,
  CheckCircle2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const SupportHubModal: React.FC = () => {
  const { isHelpModalOpen, closeHelpModal, currentUser, activeOrg, raiseTicket, setActiveTab } = useApp();

  const [category, setCategory] = useState<TicketCategory>('CANDIDATE_APPLICATION');
  const [affectedModule, setAffectedModule] = useState('APPLICATIONS');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [submittedTicketNo, setSubmittedTicketNo] = useState<string | null>(null);

  if (!isHelpModalOpen) return null;

  // Real-time Automatic Routing Preview Engine
  const calculateQueuePreview = (): { queue: SupportQueue; slaHours: number; reason: string } => {
    let queue: SupportQueue = 'GENERAL_TRIAGE';
    let reason = 'Default Platform Triage Queue';

    if (category === 'CANDIDATE_APPLICATION' || currentUser.role === 'CANDIDATE') {
      queue = 'CANDIDATE_SUPPORT';
      reason = 'Candidate Portal & Resume Upload Engine';
    } else if (category === 'RECRUITER_JOB_POSTING') {
      queue = 'RECRUITMENT_SUPPORT';
      reason = 'Recruiter Job Publishing & Requisitions Desk';
    } else if (category === 'INTERVIEW_SCHEDULING') {
      queue = 'RECRUITMENT_OPS_SUPPORT';
      reason = 'Interview Operations & Calendar Bridge';
    } else if (category === 'AGENCY_SUBMISSION' || currentUser.role === 'STAFFING_AGENCY') {
      queue = 'AGENCY_SUPPORT';
      reason = 'Staffing Agency Mandates & Placements';
    } else if (category === 'ORG_PERMISSIONS' || category === 'BILLING') {
      queue = 'ORG_SUPPORT';
      reason = 'Organization Access, Roles & Tenant Billing';
    } else if (category === 'PLATFORM_SYSTEM') {
      queue = 'PLATFORM_SUPPORT';
      reason = 'Platform Engineering & Core Microservices';
    }

    const slaMap: Record<TicketPriority, number> = {
      CRITICAL: 2,
      HIGH: 4,
      MEDIUM: 8,
      LOW: 24
    };

    return { queue, slaHours: slaMap[priority], reason };
  };

  const routePreview = calculateQueuePreview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const created = raiseTicket({
      category,
      affectedModule,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      attachmentName: attachmentName || undefined
    });

    setSubmittedTicketNo(created.ticketNumber);

    setTimeout(() => {
      setSubmittedTicketNo(null);
      setSubject('');
      setDescription('');
      setAttachmentName('');
      closeHelpModal();

      // Navigate to appropriate ticket view based on role
      if (currentUser.role === 'SUPPORT_AGENT' || currentUser.role === 'SUPPORT_MANAGER') {
        setActiveTab('support-agent');
      } else {
        setActiveTab('help-support');
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Central Helpdesk & Grievance Dispatch</h2>
              <p className="text-xs text-slate-500">
                Raise an inquiry or complaint with automated intelligent queue routing & SLA monitoring.
              </p>
            </div>
          </div>
          <button
            onClick={closeHelpModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedTicketNo ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ticket Dispatched Successfully!</h3>
              <p className="text-sm font-mono font-bold text-emerald-700 mt-1">Ticket #{submittedTicketNo}</p>
              <p className="text-xs text-slate-500 mt-2">
                Auto-routed to <span className="font-bold text-slate-700">[{routePreview.queue}]</span> with{' '}
                <span className="font-bold text-slate-700">{routePreview.slaHours}h SLA target</span>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Auto Routing Preview Callout */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-950 flex items-center gap-2">
                  <span>Intelligent Routing Preview:</span>
                  <span className="font-mono text-[11px] px-2 py-0.2 rounded-md bg-white border border-emerald-300 text-emerald-800">
                    {routePreview.queue}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 flex items-center gap-2">
                  <span>Target SLA Resolution:</span>
                  <span className="font-bold font-mono">{routePreview.slaHours} Hours</span>
                  <span>• {routePreview.reason}</span>
                </div>
              </div>
            </div>

            {/* Category & Module */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Issue Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as TicketCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="CANDIDATE_APPLICATION">Candidate Application & Resume</option>
                  <option value="RECRUITER_JOB_POSTING">Recruiter Job Posting & Requisition</option>
                  <option value="INTERVIEW_SCHEDULING">Interview Scheduling & Timezones</option>
                  <option value="AGENCY_SUBMISSION">Agency Candidate Submission & Fees</option>
                  <option value="ORG_PERMISSIONS">Organization Access & Permissions</option>
                  <option value="PLATFORM_SYSTEM">Platform Microservices & Integrations</option>
                  <option value="BILLING">Billing & Subscription Tier</option>
                  <option value="OTHER">General Inquiries / Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Affected Module *</label>
                <select
                  value={affectedModule}
                  onChange={e => setAffectedModule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="APPLICATIONS">Candidate Applications</option>
                  <option value="JOBS">Job Requisitions</option>
                  <option value="INTERVIEWS">Interview Scheduling</option>
                  <option value="OFFERS">Offer Letters & Compensation</option>
                  <option value="AGENCIES">Staffing Agency Roster</option>
                  <option value="PORTAL">Candidate Portal</option>
                  <option value="AUTH">Authentication & Roles</option>
                  <option value="SETTINGS">Organization Settings</option>
                </select>
              </div>
            </div>

            {/* Priority & Creator Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Priority Level *</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as TicketPriority)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="LOW">Low (24h SLA target)</option>
                  <option value="MEDIUM">Medium (8h SLA target)</option>
                  <option value="HIGH">High (4h SLA target)</option>
                  <option value="CRITICAL">Critical Emergency (2h SLA target)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Raised As (User & Org)</label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-mono text-[11px] truncate">
                  {currentUser.name} ({currentUser.role}) @ {activeOrg.name}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Subject / Summary *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Brief summary of the issue (e.g. Calendar invite synchronization delay)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Detailed Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide complete steps to reproduce, affected candidate or job IDs, error messages, or expected outcome..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Attachment input */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Optional Attachment / Log File</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={attachmentName}
                  onChange={e => setAttachmentName(e.target.value)}
                  placeholder="e.g. error_screenshot_2026.png or server_trace.log"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAttachmentName('hireflow_diagnostic_log.txt')}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  Simulate Attach
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeHelpModal}
                className="px-5 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
