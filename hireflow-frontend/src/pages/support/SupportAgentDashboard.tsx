import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketStatus, TicketMessage } from '../../types';
import {
  Headphones,
  Ticket,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  Lock,
  MessageSquare,
  Sparkles,
  User,
  ShieldAlert,
  ArrowRight,
  Eye,
  X,
  Sliders
} from 'lucide-react';

export const SupportAgentDashboard: React.FC = () => {
  const {
    currentUser,
    supportTickets,
    replyToTicket,
    updateTicketStatus,
    assignTicket,
    escalateTicket
  } = useApp();

  const [activeQueueTab, setActiveQueueTab] = useState<'MY_TICKETS' | 'ALL_QUEUES'>('MY_TICKETS');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Message composer
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  // Filter tickets
  const filteredTickets = supportTickets.filter(t => {
    if (activeQueueTab === 'MY_TICKETS' && t.assignedAgentId !== currentUser.id) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    const q = searchTerm.toLowerCase();
    return (
      t.ticketNumber.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.userName.toLowerCase().includes(q) ||
      t.queue.toLowerCase().includes(q)
    );
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replyToTicket(selectedTicket.id, replyText.trim(), isInternalNote);
    setReplyText('');

    // Refresh selected ticket in local view
    const updated = supportTickets.find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, newStatus);
    setSelectedTicket(prev => (prev ? { ...prev, status: newStatus } : null));
  };

  const handleClaimTicket = (ticket: SupportTicket) => {
    assignTicket(ticket.id, currentUser.id, currentUser.name);
    setSelectedTicket(prev => (prev ? { ...prev, assignedAgentId: currentUser.id, assignedAgentName: currentUser.name } : null));
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !escalationReason.trim()) return;
    escalateTicket(selectedTicket.id, escalationReason.trim());
    setShowEscalateModal(false);
    setEscalationReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Support & Complaint Desk</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Tier-2 Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Resolve incoming support grievances, post public responses, log internal staff investigation notes, and meet SLAs.
          </p>
        </div>

        {/* Queue Switcher */}
        <div className="flex items-center rounded-xl border border-slate-300 p-1 bg-white">
          <button
            onClick={() => setActiveQueueTab('MY_TICKETS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeQueueTab === 'MY_TICKETS' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Assigned Queue ({supportTickets.filter(t => t.assignedAgentId === currentUser.id).length})
          </button>
          <button
            onClick={() => setActiveQueueTab('ALL_QUEUES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeQueueTab === 'ALL_QUEUES' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Team All Queues ({supportTickets.length})
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tickets Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filter Bar */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search ticket #, subject..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_FOR_USER">Waiting for User</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Ticket Cards List */}
          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                No tickets matching queue criteria
              </div>
            ) : (
              filteredTickets.map(ticket => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            ticket.priority === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : ticket.priority === 'HIGH'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                            ? 'bg-emerald-100 text-emerald-950'
                            : ticket.status === 'IN_PROGRESS' || ticket.status === 'ASSIGNED'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{ticket.subject}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{ticket.userName} ({ticket.userRole})</span>
                      <span className="font-mono text-[10px] text-emerald-800 font-semibold">{ticket.queue}</span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>SLA: {ticket.slaDueHours}h Target</span>
                      </span>
                      <span>{ticket.messages.length} messages</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detailed Conversation & Actions (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
              {/* Ticket Header & Status Controls */}
              <div className="border-b border-slate-100 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-900">
                        {selectedTicket.ticketNumber}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Queue: {selectedTicket.queue}
                      </span>
                    </div>
                    <h2 className="text-base font-black text-slate-900 mt-1">{selectedTicket.subject}</h2>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Raised by <span className="font-bold text-slate-700">{selectedTicket.userName}</span> ({selectedTicket.userRole}) at {selectedTicket.organizationName}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : selectedTicket.status === 'IN_PROGRESS' || selectedTicket.status === 'ASSIGNED'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      {selectedTicket.status.replace(/_/g, ' ')}
                    </span>

                    {selectedTicket.assignedAgentId !== currentUser.id && (
                      <button
                        onClick={() => handleClaimTicket(selectedTicket)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Claim to My Queue
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Status Advancement Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Move Status:</span>
                  {(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'] as TicketStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        selectedTicket.status === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowEscalateModal(true)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer border border-rose-200 ml-auto"
                  >
                    Escalate
                  </button>
                </div>
              </div>

              {/* Message Thread History */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {selectedTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      msg.isInternalNote
                        ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                        : msg.senderId === currentUser.id
                        ? 'bg-emerald-50/60 border-emerald-200 ml-4'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({msg.senderRole})</span>
                        {msg.isInternalNote && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-extrabold text-[9px] flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>INTERNAL NOTE - STAFF ONLY</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp.substring(0, 16)}</span>
                    </div>

                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{msg.content}</p>

                    {msg.attachmentName && (
                      <div className="pt-1 text-[11px] font-mono text-emerald-800 font-bold flex items-center gap-1">
                        <span>Attachment: {msg.attachmentName}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Response Composer with Public vs Internal Note Switcher */}
              <form onSubmit={handleSendMessage} className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-slate-200 p-0.5 bg-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !isInternalNote ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Public Reply (User Visible)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isInternalNote ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Staff Internal Note</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {isInternalNote ? 'Hidden from ticket creator' : 'User will receive notification'}
                  </span>
                </div>

                <textarea
                  rows={3}
                  required
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={
                    isInternalNote
                      ? 'Add internal diagnostic finding, server logs, or escalation notes (staff only)...'
                      : 'Draft a helpful response for the user...'
                  }
                  className={`w-full p-3.5 rounded-2xl border text-xs outline-none focus:ring-2 resize-none ${
                    isInternalNote
                      ? 'bg-amber-50/50 border-amber-300 focus:ring-amber-500 text-amber-950 placeholder-amber-700/50'
                      : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-emerald-500 text-slate-900'
                  }`}
                />

                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Replying as: <strong className="text-slate-700">{currentUser.name}</strong>
                  </div>

                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternalNote ? 'Save Internal Note' : 'Post Public Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">Select a ticket from the queue</h3>
              <p className="text-xs">Inspect ticket history, public replies, internal investigation notes, and status.</p>
            </div>
          )}
        </div>
      </div>

      {/* ESCALATION MODAL */}
      {showEscalateModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Escalate Ticket to Support Operations</h3>
              <button onClick={() => setShowEscalateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalateSubmit} className="space-y-3.5 text-xs">
              <p className="text-slate-600">
                Escalating will mark priority as <strong>CRITICAL</strong> and alert Support Manager Victoria Stirling immediately.
              </p>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Escalation Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={escalationReason}
                  onChange={e => setEscalationReason(e.target.value)}
                  placeholder="Detail why technical engineering intervention or manager sign-off is needed..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
