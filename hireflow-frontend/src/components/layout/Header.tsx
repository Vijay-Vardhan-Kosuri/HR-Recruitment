import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Building2,
  Bell,
  LifeBuoy,
  UserCheck,
  ChevronDown,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeOrg,
    switchOrganization,
    organizations,
    openHelpModal,
    openRoleSwitcher,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    resetToDemoData
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Org Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900 tracking-tight">HireFlow</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SaaS 2.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">Recruitment Pipeline Intelligence</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* Organization Switcher (Multi-Tenant) */}
          <div className="relative">
            <button
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="max-w-[140px] truncate">{activeOrg.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-600">
                {activeOrg.tier}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isOrgDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Tenant Organization
                </div>
                {organizations.map(org => (
                  <button
                    key={org.id}
                    onClick={() => {
                      switchOrganization(org.id);
                      setIsOrgDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 cursor-pointer ${
                      org.id === activeOrg.id ? 'bg-emerald-50/70 text-emerald-950 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div>{org.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{org.domain}</div>
                    </div>
                    {org.id === activeOrg.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Universal Help & Support Button */}
          <button
            onClick={openHelpModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Help & Support</span>
          </button>

          {/* Quick Demo Role Switcher Pill */}
          <button
            onClick={openRoleSwitcher}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50/80 hover:bg-amber-100/90 text-amber-950 text-xs font-bold transition-colors cursor-pointer"
            title="Click to switch between all 7 demo user roles"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Role:</span>
            <span className="font-mono text-amber-800">{currentUser.role.replace('_', ' ')}</span>
            <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Notifications</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-mono">
                      {notifications.length}
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">No notifications yet</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setIsNotifOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo records back to fresh factory state?')) {
                resetToDemoData();
              }
            }}
            title="Reset to fresh demo data"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Current User Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              {currentUser.name
                .split(' ')
                .map(p => p[0])
                .join('')}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{currentUser.title || currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
