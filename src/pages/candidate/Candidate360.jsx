import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarLayout from '../../layouts/SidebarLayout';
import { CANDIDATE_NAV } from '../../config/sidebarNav';
import {
  fetchCandidateById, fetchAllCandidates, enrollInCourse, fetchTrainerSchedules,
  markAttendanceWithWebcam, fetchJobs, fetchNotifications
} from '../../services/api';
import WebcamModal from '../../components/WebcamModal';
import CertificateModal from '../../components/CertificateModal';
import {
  User, Award, CheckCircle2, AlertTriangle, BookOpen, Clock, Camera,
  FileText, Briefcase, TrendingUp, Sparkles, ArrowRight, ShieldCheck, Download, Layers, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Candidate360() {
  const { currentUser } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState('');
  
  // Webcam Modal State
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [activeSchedule, setActiveSchedule] = useState(null);

  // Certificate Modal State
  const [showCertificate, setShowCertificate] = useState(false);

  const loadCandidateData = async () => {
    try {
      const candidatesList = await fetchAllCandidates();
      setAllCandidates(candidatesList || []);

      let targetId = currentUser?.candidateId || currentUser?.id || currentUser?.email || (candidatesList && candidatesList[0] ? candidatesList[0].candidateId : null);
      let data = null;
      if (targetId) {
        data = await fetchCandidateById(targetId);
      }
      if (!data && candidatesList && candidatesList.length > 0) {
        data = candidatesList.find(c => c.candidateId === currentUser?.id || c.email === currentUser?.email) || candidatesList[0];
      }
      if (!data && currentUser) {
        data = {
          candidateId: currentUser.candidateId || currentUser.id || 'MH-CAND-DEMO',
          name: currentUser.name || 'Candidate',
          email: currentUser.email || 'candidate@example.com',
          district: currentUser.district || 'Pune',
          educationLevel: 'Diploma / Graduate',
          skills: ['JavaScript', 'HTML/CSS', 'Git', 'React'],
          employmentStatus: 'Seeking Employment',
          attendanceHistory: [],
          certificates: [],
          milestones: [{ milestone: 'Profile Registered', date: '2026-09-06', details: 'Active Skilling Candidate' }]
        };
      }

      setCandidate(data || candidatesList?.[0] || null);

      if (data?.candidateId) {
        const notifs = await fetchNotifications(data.candidateId);
        setNotifications(notifs || []);
      }

      const schs = await fetchTrainerSchedules('all');
      setSchedules(schs || []);

      const jList = await fetchJobs();
      setJobs(jList || []);
    } catch (err) {
      console.error('Error loading Candidate360:', err);
    }
  };

  useEffect(() => {
    loadCandidateData();
  }, [currentUser]);

  // Handle Course Enrollment
  const handleEnroll = async (courseId) => {
    if (!candidate) return;
    const res = await enrollInCourse(candidate.candidateId, courseId);
    if (res.candidate) {
      setCandidate(res.candidate);
      setToast('🎉 Course Enrolled! Sent to Provider for Trainer Assignment.');
      setTimeout(() => setToast(''), 4000);
      loadCandidateData();
    }
  };

  // Submit Webcam Photo
  const handlePhotoSubmit = async (photoData) => {
    if (!candidate || !activeSchedule) return;
    const res = await markAttendanceWithWebcam({
      candidateId: candidate.candidateId,
      scheduleId: activeSchedule.id,
      photoData
    });
    if (res.attendanceReq) {
      setToast('📷 Live Camera Attendance Photo Submitted to Trainer!');
      setTimeout(() => setToast(''), 4000);
      loadCandidateData();
    }
  };

  if (!candidate) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 bg-slate-800 rounded-3xl border border-slate-700 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
            MH
          </div>
          <h2 className="text-xl font-black">No Candidate Selected</h2>
          <p className="text-xs text-slate-400">
            Please register a candidate or select an active profile to view the 360° Analytics Dashboard.
          </p>
          <Link to="/register" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition">
            Register New Candidate
          </Link>
        </div>
      </div>
    );
  }

  const currentCourse = candidate.enrolledCourse;
  const bestJob = jobs[0];
  const latestWage = candidate.salaryProgression?.[candidate.salaryProgression.length - 1]?.salary || 28000;

  return (
    <SidebarLayout sidebarItems={CANDIDATE_NAV} roleName="Candidate Portal" roleColor="emerald">
      <div className="space-y-6 animate-fadeInUp pb-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" /> {toast}
        </div>
      )}

      {/* ── CANDIDATE 360 PROFILE HEADER CARD (Compact & Sleek) ───────────────── */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              {candidate.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-black text-slate-900">{candidate.name}</h1>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                  candidate.employmentStatus.includes('EMPLOYED') 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {candidate.employmentStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {candidate.educationLevel} • {candidate.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 sm:self-center">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Resume: <strong>{candidate.resumeName}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-semibold text-slate-700">
              Status: <strong className="text-emerald-700">{candidate.trainingStatus}</strong>
            </span>
          </div>
        </div>

        {/* Compact Lifecycle Progress Stepper Bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            <span>Lifecycle Pipeline</span>
            <span className="text-emerald-700 font-extrabold">Step {candidate.certificates?.length > 0 ? '6' : candidate.assignedTrainer ? '3' : candidate.enrolledCourse ? '2' : '1'} of 8 Active</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {['1. Register', '2. Course Enroll', '3. Trainer Assigned', '4. Camera Attendance', '5. Assessment', '6. Certificate', '7. Job Applied', '8. HR Verified'].map((m, i) => {
              const activeStep = candidate.certificates?.length > 0 ? 6 : candidate.assignedTrainer ? 3 : candidate.enrolledCourse ? 2 : 1;
              const isDone = i < activeStep;
              const isCurrent = i === activeStep - 1;
              return (
                <div
                  key={m}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white font-extrabold shadow-2xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {m}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications Banner (If Any) */}
      {notifications.length > 0 && (
        <div className="p-3.5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl border border-blue-700/60 shadow-sm flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-sm shrink-0">
              🔔
            </span>
            <div>
              <p className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">Latest System Notification</p>
              <p className="font-bold text-white mt-0.5">{notifications[0].title}: {notifications[0].message}</p>
            </div>
          </div>
          <span className="text-[10px] text-blue-300 shrink-0">{notifications[0].time}</span>
        </div>
      )}

      {/* ── 6 KPI STAT CARDS GRID ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Skills</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{candidate.skills?.length || 0}</p>
          <p className="text-[10px] font-bold text-purple-700">Acquired Skills</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Course</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-sm font-black text-slate-900 truncate">{candidate.enrolledCourse ? 'Enrolled' : 'None'}</p>
          <p className="text-[10px] font-bold text-amber-700 truncate">{candidate.trainingStatus}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Attendance</span>
            <Camera className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{candidate.attendanceHistory?.length || 0}</p>
          <p className="text-[10px] font-bold text-emerald-700">Verified Sessions</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Certificate</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm font-black text-slate-900">{candidate.certificates?.length > 0 ? 'Issued' : 'Pending'}</p>
          <p className="text-[10px] font-bold text-blue-700">Single Source DB</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Job Match</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-slate-900">80%</p>
          <p className="text-[10px] font-bold text-indigo-700">Top Match Rating</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Wage Growth</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-slate-900">₹{(latestWage/1000).toFixed(0)}k/mo</p>
          <p className="text-[10px] font-bold text-emerald-700">Verified Progression</p>
        </div>
      </div>

      {/* ── 3 EXECUTIVE OVERVIEW SUMMARY ROWS ───────────────────────────── */}
      
      {/* ROW 1: Skills Summary + Training Course Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Skills Summary Card */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" /> Skill Competencies & AI Gap Engine
              </h2>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full">
                {candidate.skills?.length || 0} Skills
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(candidate.skills || []).map(skill => (
                <span key={skill} className="bg-slate-100 text-slate-800 text-[11px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-purple-600" /> {skill}
                </span>
              ))}
            </div>

            {candidate.skillGap && candidate.skillGap.length > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-[11px]"><strong>Detected Skill Gap:</strong> {candidate.skillGap.join(', ')}</p>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Skill Provenance & Audit Log Complete
              </div>
            )}
          </div>

          <Link
            to="/candidate/skills"
            className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition"
          >
            Open Full Skill Analysis & Provenance <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Training & Course Summary Card */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" /> Training & Course Program
              </h2>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {candidate.trainingStatus}
              </span>
            </div>

            {currentCourse ? (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-[9px] font-extrabold uppercase text-amber-800">Active Enrolled Course</span>
                <h3 className="text-xs font-black text-slate-900">{currentCourse.title}</h3>
                <p className="text-[11px] text-slate-600">Provider: {currentCourse.provider || candidate.assignedProvider || 'ABC Skill Centre Pune'}</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center text-xs space-y-1">
                <p className="font-bold text-slate-700">No Course Currently Enrolled</p>
                <p className="text-[11px] text-slate-500">Explore NCVT bridge courses to upgrade your employable skill set.</p>
              </div>
            )}
          </div>

          <Link
            to="/candidate/training"
            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition"
          >
            Go to Course & Enrollment Portal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ROW 2: Camera Attendance Summary + Certificates Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Summary Card */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" /> Live Camera Attendance Verification
              </h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {candidate.attendanceHistory?.length || 0} Records
              </span>
            </div>

            {schedules.length > 0 ? (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Scheduled Session</span>
                  <h3 className="font-extrabold text-slate-900 mt-1">{schedules[0].topic}</h3>
                  <p className="text-[10px] text-slate-500">{schedules[0].date} at {schedules[0].time}</p>
                </div>
                <button
                  onClick={() => { setActiveSchedule(schedules[0]); setIsWebcamOpen(true); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" /> Mark Live Photo
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 p-3 bg-slate-50 rounded-xl text-center">No active training schedule session scheduled.</p>
            )}
          </div>

          <Link
            to="/candidate/attendance"
            className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition"
          >
            View Live Camera Attendance Log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Certificates & Assessment Summary Card */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-600" /> Digital Certificates &amp; Credentials
              </h2>
              <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                {candidate.certificates?.length || 0} Credential(s) Available
              </span>
            </div>

            {candidate.certificates?.length > 0 ? (
              <div className="space-y-2">
                {candidate.certificates.slice(0, 2).map((cert, cIdx) => (
                  <div
                    key={cIdx}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                      cert.isExternal
                        ? "bg-blue-50/70 border-blue-200"
                        : "bg-cyan-50/70 border-cyan-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-slate-900">{cert.courseTitle}</h3>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          cert.isExternal ? "bg-blue-100 text-blue-800" : "bg-cyan-100 text-cyan-800"
                        }`}>
                          {cert.isExternal ? "Added External" : "🏆 Exam Achieved"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                        ID: {cert.certificateId} · Score: {cert.score || "100%"}
                      </p>
                    </div>
                    <Link
                      to="/candidate/certificates"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" /> View
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-amber-950">No Certificates Added Yet</p>
                <p className="text-[11px] text-amber-800">Take course assessment or add external certifications to verify on your profile.</p>
              </div>
            )}
          </div>

          <Link
            to="/candidate/certificates"
            className="w-full py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-200 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition"
          >
            Manage All Certificates (Achieved &amp; Added) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ROW 3: Job Marketplace Summary + Longitudinal Outcome Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Job Marketplace Summary Card */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Industry Job Matching Intelligence
              </h2>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                {jobs.length} Jobs Active
              </span>
            </div>

            {bestJob && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <h3 className="font-black text-slate-900">{bestJob.title}</h3>
                  <p className="text-[11px] text-blue-900 font-bold">{bestJob.company} • {bestJob.location}</p>
                  <p className="text-[10px] text-slate-500">Salary: {bestJob.salary}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-black text-xs">
                  80% Match
                </span>
              </div>
            )}
          </div>

          <Link
            to="/candidate/jobs"
            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition"
          >
            Explore Full Job Marketplace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Longitudinal Outcome & Salary Curve Summary Card */}
        <div className="p-5 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Longitudinal Outcome & Wage Curve
              </h2>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                Live Tracking
              </span>
            </div>

            <div className="h-28 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={candidate.salaryProgression || []}>
                  <defs>
                    <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="period" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => [`₹${v.toLocaleString('en-IN')}/mo`, 'Salary']} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={2} fill="url(#miniGrad)" dot={{ r: 3, fill: '#10b981' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Link
            to="/candidate/longitudinal"
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black rounded-xl text-center flex items-center justify-center gap-1.5 transition"
          >
            View Longitudinal Tracking & Time Simulator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Webcam Attendance Modal */}
      <WebcamModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onSubmitPhoto={handlePhotoSubmit}
        topicTitle={activeSchedule?.topic}
      />

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          candidate={candidate}
          onClose={() => setShowCertificate(false)}
        />
      )}

      </div>
    </SidebarLayout>
  );
}
