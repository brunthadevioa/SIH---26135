import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../../layouts/SidebarLayout';
import { EMPLOYER_NAV } from '../../config/sidebarNav';
import { fetchAllCandidates, fetchNotifications } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, ShieldCheck, CheckCircle2, FileText, Search, UserCheck, ArrowRight, Award, MessageSquare, Briefcase, Clock, Sparkles } from 'lucide-react';

export default function EmployerDashboard() {
  const { refreshStats } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const loadEmployerData = async () => {
    const list = await fetchAllCandidates();
    setCandidates(list.filter(c => c.employmentStatus !== 'Seeking Employment' || c.certificates?.length > 0));
    refreshStats();
    const notifs = await fetchNotifications('employer');
    setNotifications(notifs || []);
  };

  useEffect(() => {
    loadEmployerData();
  }, []);

  const employedCount = candidates.filter(c => c.employmentStatus?.includes('EMPLOYED')).length;
  const offeredCount = candidates.filter(c => c.employmentStatus?.includes('Offer') || c.employmentStatus?.includes('Extended')).length;
  const inReviewCount = candidates.filter(c => !c.employmentStatus?.includes('EMPLOYED') && !c.employmentStatus?.includes('Offer')).length;

  return (
    <SidebarLayout sidebarItems={EMPLOYER_NAV} roleName="Employer HR Portal" roleColor="blue">
      <div className="space-y-6 animate-fadeInUp p-6">

        {/* Header */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              Corporate HR Portal
            </span>
            <h1 className="text-lg font-black text-slate-900">TechCorp India Ltd</h1>
            <p className="text-[11px] text-slate-500 font-medium">Talent Acquisition, Candidate Verification &amp; Corporate Onboarding</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl text-center">
              <p className="text-sm font-black text-blue-900">{candidates.length}</p>
              <p className="text-[9px] text-blue-700 font-extrabold uppercase">Total Applications</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-center">
              <p className="text-sm font-black text-emerald-900">{employedCount}</p>
              <p className="text-[9px] text-emerald-700 font-extrabold uppercase">Hired Candidates</p>
            </div>
          </div>
        </div>

        {/* Key Hiring Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Applications in Review</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{inReviewCount} <span className="text-xs font-normal text-slate-500">pending evaluation</span></p>
            <p className="text-xs text-slate-500">Candidates awaiting credential check &amp; interview scheduling.</p>
            <Link to="/employer/pipeline" className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-900 pt-1">
              Open HR Hiring Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Digital Certificate Audits</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">Cryptographic <span className="text-xs font-normal text-slate-500">SHA-256</span></p>
            <p className="text-xs text-slate-500">Instantly authenticate candidate certificates &amp; camera attendance.</p>
            <Link to="/employer/verify" className="inline-flex items-center gap-1 text-xs font-extrabold text-purple-700 hover:text-purple-900 pt-1">
              Verify Digital Certificate <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Job Offers &amp; Onboarding</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{offeredCount + employedCount} <span className="text-xs font-normal text-slate-500">offers extended</span></p>
            <p className="text-xs text-slate-500">Official offer letters issued with tamper-proof IDs.</p>
            <Link to="/employer/pipeline" className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 pt-1">
              Manage Onboarding <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Active Corporate Job Postings Summary */}
        <div className="gov-card p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-700" /> Active Corporate Job Vacancies (7 Openings)
            </h2>
            <Link to="/employer/pipeline" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
              Review Pipeline <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md">TechCorp India Ltd</span>
                <span className="text-xs font-bold text-emerald-700">₹3,60,000 / Year</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">React Frontend Engineer</h3>
              <p className="text-xs text-slate-500">Location: Pune, MH · Skills: React, JavaScript, Tailwind CSS</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-purple-100 text-purple-900 rounded-md">GlobalTech Solutions</span>
                <span className="text-xs font-bold text-emerald-700">₹4,20,000 / Year</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Node.js Backend Engineer</h3>
              <p className="text-xs text-slate-500">Location: Mumbai, MH · Skills: Node.js, Express, REST APIs</p>
            </div>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}
