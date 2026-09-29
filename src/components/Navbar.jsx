import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Award, User, GraduationCap, BookOpen, Building2, Shield,
  Database, Bell, ChevronDown, LogOut, Sparkles, Globe
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

export default function Navbar() {
  const { currentUser, logout, loginAsDemoRole, dbStats } = useAuth();
  const { language, setLanguage, languages, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleSwitch = (role) => {
    loginAsDemoRole(role);
    setIsDropdownOpen(false);
    if (role === 'candidate') navigate('/candidate/skills');
    else if (role === 'provider') navigate('/provider/dashboard');
    else if (role === 'trainer') navigate('/trainer/dashboard');
    else if (role === 'employer') navigate('/employer/dashboard');
    else if (role === 'government') navigate('/government/dashboard');
  };

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-4 md:px-6 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white uppercase block leading-none">
              {t('brandName', 'MahaSkill 360')}
            </span>
            <span className="text-[9px] font-bold text-slate-400 hidden sm:block mt-0.5">
              {t('brandSub', 'Government of Maharashtra Skill Mission')}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-xl transition-all ${location.pathname === '/' ? 'bg-slate-800 text-white font-bold' : 'hover:text-white hover:bg-slate-800/60'}`}
          >
            {t('home', 'Home')}
          </Link>
          <button
            onClick={() => handleRoleSwitch('candidate')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${location.pathname.startsWith('/candidate') ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold' : 'hover:text-white hover:bg-slate-800/60'}`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" /> {t('candidatePortal', 'Candidate Portal')}
          </button>
          <Link
            to="/provider/dashboard"
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${location.pathname.startsWith('/provider') ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold' : 'hover:text-white hover:bg-slate-800/60'}`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> {t('providerPortal', 'Provider')}
          </Link>
          <Link
            to="/trainer/dashboard"
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${location.pathname.startsWith('/trainer') ? 'bg-amber-600/20 border border-amber-500/30 text-amber-300 font-bold' : 'hover:text-white hover:bg-slate-800/60'}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> {t('trainerPortal', 'Trainer')}
          </Link>
          <Link
            to="/employer/dashboard"
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${location.pathname.startsWith('/employer') ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-bold' : 'hover:text-white hover:bg-slate-800/60'}`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {t('employerPortal', 'HR / Employer')}
          </Link>
          <Link
            to="/government/dashboard"
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${location.pathname.startsWith('/government') ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold' : 'hover:text-white hover:bg-slate-800/60'}`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" /> {t('governmentPortal', 'Government')}
          </Link>
        </div>

        {/* Live Counter Pill */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-slate-300 text-xs">
            {t('candidatesCount', 'Candidates')}: <strong className="text-emerald-400 font-extrabold">{dbStats.totalCandidates || 0}</strong>
          </span>
        </div>

        {/* Right Actions: Language Switcher + Notifications + Role/User Dropdown */}
        <div className="flex items-center gap-2">
          
          {/* Multilingual Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 transition cursor-pointer shadow-sm"
              title="Change Language / भाषा बदला"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-black text-xs text-white">{currentLangObj.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-1.5 z-50 animate-fadeIn text-xs">
                <div className="px-3 py-1 border-b border-slate-800">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('language', 'Language')} / भाषा
                  </p>
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between transition cursor-pointer ${
                      language === l.code
                        ? 'bg-blue-600/30 text-cyan-300 font-black border-l-2 border-cyan-400'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.fullLabel}</span>
                    </span>
                    {language === l.code && <span className="text-[10px] text-cyan-400 font-black">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell Button */}
          {currentUser && (
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition cursor-pointer"
              title="System Messages & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
            </button>
          )}

          {/* User Profile / Role Switcher */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="font-bold text-white text-xs">{currentUser.name}</p>
                  <p className="text-[9px] text-blue-400 uppercase tracking-wider">{currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Quick Switch Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-extrabold text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{currentUser.email || currentUser.id}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-4 py-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      {t('roleSwitcher', 'Demo Role Switcher')}
                    </p>
                    <button
                      onClick={() => handleRoleSwitch('candidate')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-400" /> {t('candidatePortal', 'Candidate Portal')}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('provider')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> {t('providerPortal', 'Training Provider')}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('trainer')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" /> {t('trainerPortal', 'Trainer / Faculty')}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('employer')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" /> {t('employerPortal', 'HR / Employer')}
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('government')}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> {t('governmentPortal', 'Government Directorate')}
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" /> {t('logout', 'Sign Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs text-slate-200 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Notification Drawer Modal */}
      {showNotifications && (
        <NotificationDrawer
          userId={currentUser?.id || currentUser?.candidateId}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </nav>
  );
}
