import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight, ShieldCheck, TrendingUp, Sparkles,
  Cpu, Briefcase
} from 'lucide-react';

export default function LandingPage() {
  const { dbStats, loginAsDemoRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleRoleQuickDemo = (role) => {
    loginAsDemoRole(role);
    if (role === 'candidate') navigate('/candidate/skills');
    else if (role === 'provider') navigate('/provider/dashboard');
    else if (role === 'trainer') navigate('/trainer/dashboard');
    else if (role === 'employer') navigate('/employer/dashboard');
    else if (role === 'government') navigate('/government/dashboard');
  };

  return (
    <div className="space-y-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeInUp">

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none blur-2xl" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t('stateSkillingPlatform', 'State Skilling Platform')}
            </span>
            <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {t('outcomeProvenanceEngine', 'Outcome & Provenance Engine')}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white uppercase">
            {t('heroTitle', 'SKILL MISSION')}
          </h1>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/register"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              {t('registerCandidateBtn', '📝 Register Candidate')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/candidate/skills"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-cyan-300" /> {t('aiSkillGapBtn', 'AI Skill Gap Analysis')}
            </Link>
            <Link
              to="/candidate/jobs"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-amber-300" /> {t('jobMarketplaceBtn', 'Job Marketplace')}
            </Link>
          </div>
        </div>

        {/* Live Metrics Row inside Hero */}
        <div className="mt-10 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-2xl font-black text-white">{dbStats.totalCandidates || 0}</p>
            <p className="text-[11px] text-slate-400 font-semibold">{t('registeredCandidates', 'Registered Candidates')}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-2xl font-black text-purple-400">{dbStats.activeStudents || 0}</p>
            <p className="text-[11px] text-slate-400 font-semibold">{t('activeInTraining', 'Active in Training')}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-2xl font-black text-amber-400">{dbStats.certifiedCount || 0}</p>
            <p className="text-[11px] text-slate-400 font-semibold">{t('verifiedCertificates', 'Verified Certificates')}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-2xl font-black text-emerald-400">{dbStats.employedCount || 0}</p>
            <p className="text-[11px] text-slate-400 font-semibold">{t('corporatePlacements', 'Corporate Placements')}</p>
          </div>
        </div>
      </div>

      {/* ── Key System Features & Pillars ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="gov-card p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">{t('aiGapAnalyzerTitle', 'AI/ML Skill Gap Analyzer')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('aiGapAnalyzerDesc', 'Measures candidate competency matches against live industry career benchmarks and recommends 1-click bridge courses.')}
          </p>
        </div>

        <div className="gov-card p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-purple-700" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">{t('cryptographicVerificationTitle', 'Cryptographic Verification')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('cryptographicVerificationDesc', 'SHA-256 ledger security, QR code credential lookups, and neural fraud scanners to prevent fake certificates.')}
          </p>
        </div>

        <div className="gov-card p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">{t('wageTrackingTitle', 'Longitudinal Wage Tracking')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('wageTrackingDesc', 'Multi-year post-placement wage growth tracking with continuous upskilling interventions and state analytics.')}
          </p>
        </div>
      </div>

      {/* ── Stakeholder Demo Portals ──────────────────────────────────────── */}
      <div className="gov-card p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl space-y-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black">{t('interactivePortalsTitle', 'Interactive Stakeholder Portals')}</h2>
            <p className="text-xs text-slate-400">{t('interactivePortalsSub', 'Launch any portal to observe synchronized state across all modules')}</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full w-fit">
            {t('realTimeSynchronized', '● Real-Time Synchronized')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { role: 'candidate', emoji: '🧑‍🎓', labelKey: 'candidateCardTitle', labelDef: 'Candidate 360', subKey: 'candidateCardSub', subDef: 'Skills, Attendance & Offers', color: 'hover:border-emerald-400 hover:bg-emerald-950/40' },
            { role: 'provider', emoji: '🏫', labelKey: 'providerCardTitle', labelDef: 'Training Provider', subKey: 'providerCardSub', subDef: 'Course & Trainer Allocation', color: 'hover:border-purple-400 hover:bg-purple-950/40' },
            { role: 'trainer',  emoji: '👩‍🏫', labelKey: 'trainerCardTitle', labelDef: 'Trainer Portal',  subKey: 'trainerCardSub', subDef: 'Attendance & Evaluations', color: 'hover:border-amber-400 hover:bg-amber-950/40' },
            { role: 'employer', emoji: '🏢', labelKey: 'employerCardTitle', labelDef: 'HR / Employer',   subKey: 'employerCardSub', subDef: 'Job Offers & Verification', color: 'hover:border-blue-400 hover:bg-blue-950/40' },
            { role: 'government', emoji: '🏛️', labelKey: 'governmentCardTitle', labelDef: 'State Government', subKey: 'governmentCardSub', subDef: 'Impact & Wage Analytics', color: 'hover:border-blue-400 hover:bg-blue-950/40' },
          ].map(p => (
            <button
              key={p.role}
              onClick={() => handleRoleQuickDemo(p.role)}
              className={`bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-left space-y-2 transition-all cursor-pointer group ${p.color}`}
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{p.emoji}</div>
              <div className="font-black text-xs sm:text-sm text-white">{t(p.labelKey, p.labelDef)}</div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight">{t(p.subKey, p.subDef)}</div>
              <div className="pt-1 text-[10px] font-extrabold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {t('openPortal', 'Open')} <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
