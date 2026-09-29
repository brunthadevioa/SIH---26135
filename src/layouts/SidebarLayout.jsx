import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

const PATH_TO_KEY = {
  '/candidate/skills': 'skillsConsent',
  '/candidate/provenance': 'skillProvenance',
  '/candidate/training': 'coursesEnrollment',
  '/candidate/attendance': 'cameraAttendance',
  '/candidate/certificates': 'certificatesResults',
  '/candidate/jobs': 'jobMarketplace',
  '/candidate/longitudinal': 'longitudinalTracking',
  '/candidate/messages': 'messages',
  '/trainer/dashboard': 'trainerOverview',
  '/trainer/candidates': 'myCandidates',
  '/trainer/schedule': 'createSchedule',
  '/trainer/assessment': 'assessments',
  '/trainer/attendance': 'cameraVerification',
  '/trainer/messages': 'messages',
  '/provider/dashboard': 'providerOverview',
  '/provider/candidates': 'candidateCohort',
  '/provider/trainers': 'certifiedFaculty',
  '/provider/assign': 'trainerAssignment',
  '/provider/messages': 'messages',
  '/employer/dashboard': 'trainerOverview',
  '/employer/verify': 'verifyCredentials',
  '/employer/pipeline': 'hrPipeline',
  '/employer/messages': 'messages',
  '/government/dashboard': 'impactOverview',
  '/government/analytics': 'districtAnalytics',
  '/government/followups': 'followupEngine',
  '/government/candidates': 'candidateRegistry',
  '/government/messages': 'messages',
};

const SECTION_TO_KEY = {
  'My Dashboard': 'myDashboard',
  'Trainer Modules': 'trainerPortal',
  'Provider Modules': 'providerPortal',
  'HR Modules': 'employerPortal',
  'Policy & Analytics': 'governmentPortal'
};

export default function SidebarLayout({ sidebarItems, roleColor = 'blue', children }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const colorMap = {
    blue:   { bg: 'bg-blue-950',   border: 'border-blue-800',   active: 'bg-blue-600 text-white',   hover: 'hover:bg-blue-900/60 hover:text-white', text: 'text-blue-300', dot: 'bg-blue-400' },
    amber:  { bg: 'bg-amber-950',  border: 'border-amber-800',  active: 'bg-amber-500 text-slate-950', hover: 'hover:bg-amber-900/60 hover:text-white', text: 'text-amber-300', dot: 'bg-amber-400' },
    emerald:{ bg: 'bg-emerald-950',border: 'border-emerald-800',active: 'bg-emerald-600 text-white', hover: 'hover:bg-emerald-900/60 hover:text-white', text: 'text-emerald-300', dot: 'bg-emerald-400' },
    purple: { bg: 'bg-purple-950', border: 'border-purple-800', active: 'bg-purple-600 text-white',  hover: 'hover:bg-purple-900/60 hover:text-white', text: 'text-purple-300', dot: 'bg-purple-400' },
    orange: { bg: 'bg-orange-950', border: 'border-orange-800', active: 'bg-orange-600 text-white',  hover: 'hover:bg-orange-900/60 hover:text-white', text: 'text-orange-300', dot: 'bg-orange-400' },
  };
  const c = colorMap[roleColor] || colorMap.blue;

  const getTranslatedLabel = (item) => {
    const key = PATH_TO_KEY[item.path];
    return key ? t(key, item.label) : item.label;
  };

  const getTranslatedSection = (sectionLabel) => {
    const key = SECTION_TO_KEY[sectionLabel];
    return key ? t(key, sectionLabel) : sectionLabel;
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${c.bg} text-white`}>
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${c.border}`}>
        {!collapsed && (
          <div>
            <p className={`text-[9px] font-extrabold uppercase tracking-widest ${c.text}`}>
              {t(sidebarItems.role, sidebarItems.role)}
            </p>
            <p className="text-xs font-black text-white mt-0.5">{t(sidebarItems.name, sidebarItems.name)}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-xl ${c.hover} transition cursor-pointer hidden lg:flex items-center justify-center shrink-0`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className={`p-1.5 rounded-xl ${c.hover} transition cursor-pointer lg:hidden`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-3">
        {(sidebarItems.sections || []).map((section) => (
          <div key={section.label} className="space-y-1.5">
            {!collapsed && (
              <p className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 ${c.text} opacity-70`}>
                {getTranslatedSection(section.label)}
              </p>
            )}
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path) && item.exact !== false);
                const translatedLabel = getTranslatedLabel(item);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? translatedLabel : ''}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? `${c.active} shadow-md font-extrabold ring-1 ring-white/20` 
                        : `text-slate-300 ${c.hover}`
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? '' : c.text}`} />
                    {!collapsed && <span>{translatedLabel}</span>}
                    {!collapsed && isActive && (
                      <span className={`ml-auto w-2 h-2 rounded-full ${c.dot} shadow-sm`} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div className={`px-4 py-3 border-t ${c.border}`}>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t('brandName', 'MahaSkill 360')}</p>
          <p className="text-[9px] text-slate-500">{t('stateTrustEngine', 'Single-Source Trust Engine')}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ width: '240px', top: '57px' }}>
          <SidebarContent />
        </div>

        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 border-r border-slate-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}
          style={{ minHeight: 'calc(100vh - 57px)' }}
        >
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden px-4 pt-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm cursor-pointer"
            >
              <Menu className="w-4 h-4" /> {t('openMenu', 'Open Menu')}
            </button>
          </div>

          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-3 px-4 text-center text-[10px] border-t border-slate-800">
        {t('skillMissionFooter', 'Skill Mission Analytics & Career Provenance Engine · Government of Maharashtra')}
      </footer>
    </div>
  );
}
