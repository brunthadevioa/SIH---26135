import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { PROVIDER_NAV } from "../../config/sidebarNav";
import { fetchAllCandidates, fetchTrainers, fetchNotifications } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  GraduationCap,
  Users,
  UserCheck,
  Award,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProviderDashboard() {
  const { refreshStats } = useAuth();
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const loadProviderData = async () => {
    const [list, tList] = await Promise.all([
      fetchAllCandidates(),
      fetchTrainers(),
      fetchNotifications("provider"),
    ]);
    setCandidates(list || []);
    setTrainers(tList || []);
    refreshStats();
  };

  useEffect(() => {
    loadProviderData();
  }, []);

  const unassignedCount = candidates.filter((c) => !c.assignedTrainer).length;
  const certifiedCount = candidates.filter((c) => c.status === "Certified" || c.certificateIssued).length;
  const availableTrainersCount = trainers.filter((t) => t.assignedCount === 0 || t.status?.includes("Free")).length;

  return (
    <SidebarLayout sidebarItems={PROVIDER_NAV} roleName="Training Provider" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 bg-purple-800/60 px-3 py-1 rounded-full border border-purple-400/30">
              {t('trainingProviderPortal', 'Training Provider Center Portal')}
            </span>
            <h1 className="text-xl font-black text-white mt-1">ABC Skill Centre</h1>
            <p className="text-xs text-purple-200">
              {t('authorizedPartner', 'Authorized Technical Skilling Partner • 5 Certified Faculty Specialists • 7 NSQF Courses')}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Link
              to="/provider/assign"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" /> {t('allocateCandidatesBtn', 'Allocate Candidates →')}
            </Link>
          </div>
        </div>

        {/* Executive KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{candidates.length}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('totalEnrolledTrainees', 'Total Enrolled Trainees')}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{trainers.length}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {t('facultyPool', 'Faculty Pool')} ({availableTrainersCount})
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{unassignedCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('pendingTrainerAllocation', 'Pending Trainer Allocation')}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{certifiedCount}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('verifiedCertifications', 'Verified Certifications')}</p>
          </div>
        </div>

        {/* Dedicated Quick Navigation Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/provider/candidates"
            className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-sm group-hover:text-purple-700 transition">
                {t('candidateCohort', 'Candidate Cohort')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('candidateCohortDesc', 'View all registered candidates, enrolled training pathways, and individual skill gap profiles.')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>{candidates.length} Trainees</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition">{t('openModule', 'Open Module →')}</span>
            </div>
          </Link>

          <Link
            to="/provider/trainers"
            className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-sm group-hover:text-purple-700 transition">
                {t('certifiedFaculty', 'Certified Faculty')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('facultyDesc', 'Dedicated page managing 5 certified faculty specialists, domain accreditations, workload, and availability.')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>{trainers.length} Trainers</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition">{t('openModule', 'Open Module →')}</span>
            </div>
          </Link>

          <Link
            to="/provider/assign"
            className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-sm group-hover:text-purple-700 transition">
                {t('trainerAssignment', 'Trainer Assignment Console')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('trainerAssignDesc', 'Dedicated page for 1-click candidate-to-faculty allocation, filtering unassigned candidates, and auto-pairing.')}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{unassignedCount} Unassigned</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition">{t('openConsole', 'Open Console →')}</span>
            </div>
          </Link>
        </div>

        {/* Center Operations & Quality Assurance */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900">{t('accreditationStandards', 'Accreditation & Delivery Standards')}</h2>
              <p className="text-xs text-slate-500">{t('qualityBenchmarks', 'Quality benchmarks monitored across all training batches')}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t('centerVerified', 'Center Verified')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('cameraAttendanceCompliance', 'Camera Attendance Compliance')}</span>
              <p className="text-lg font-black text-slate-900">96.4%</p>
              <p className="text-[11px] text-emerald-700 font-semibold">{t('exceedsStandard', '✓ Exceeds 80% State Standard')}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('averageFacultyRating', 'Average Faculty Rating')}</span>
              <p className="text-lg font-black text-slate-900">4.9 / 5.0</p>
              <p className="text-[11px] text-purple-700 font-semibold">{t('highStudentSatisfaction', '★ High Student Satisfaction')}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('corporatePlacementRate', 'Corporate Placement Rate')}</span>
              <p className="text-lg font-black text-slate-900">78.5%</p>
              <p className="text-[11px] text-blue-700 font-semibold">{t('activeHiringLinkage', '↗ Active Corporate Hiring Linkage')}</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
