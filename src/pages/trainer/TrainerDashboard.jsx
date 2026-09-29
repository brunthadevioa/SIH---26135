import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../../layouts/SidebarLayout';
import { TRAINER_NAV } from '../../config/sidebarNav';
import { fetchAllCandidates, fetchTrainerSchedules, fetchAttendanceRequests, fetchNotifications } from '../../services/api';
import { Users, Calendar, ClipboardList, Camera, MessageSquare, ArrowRight, CheckCircle2, Clock, Award, Sparkles, BookOpen } from 'lucide-react';

export default function TrainerDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [attRequests, setAttRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchAllCandidates(),
      fetchTrainerSchedules('trn-01'),
      fetchAttendanceRequests(),
      fetchNotifications('trainer')
    ]).then(([list, schList, reqs, notifs]) => {
      setCandidates(list.filter(c => c.assignedTrainer?.id === 'trn-01' || c.trainingStatus !== 'Not Enrolled'));
      setSchedules(schList || []);
      setAttRequests(reqs || []);
      setNotifications(notifs || []);
    });
  }, []);

  const pendingAtt = attRequests.filter(r => r.status !== 'Verified').length;
  const verifiedAtt = attRequests.filter(r => r.status === 'Verified').length;

  return (
    <SidebarLayout sidebarItems={TRAINER_NAV} roleName="Trainer Portal" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-md">
              Faculty Instructor
            </span>
            <h1 className="text-lg font-black text-slate-900 mt-1">Trainer A (React &amp; Frontend Lead)</h1>
            <p className="text-xs text-slate-500">ABC Skill Centre · Live Training &amp; Assessment Management</p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl text-center">
              <p className="text-base font-black text-purple-900">{candidates.length}</p>
              <p className="text-[9px] text-purple-700 font-extrabold uppercase">Assigned Candidates</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center">
              <p className="text-base font-black text-amber-900">{schedules.length}</p>
              <p className="text-[9px] text-amber-700 font-extrabold uppercase">Active Sessions</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
              <p className="text-base font-black text-emerald-900">{pendingAtt}</p>
              <p className="text-[9px] text-emerald-700 font-extrabold uppercase">Pending Verification</p>
            </div>
          </div>
        </div>

        {/* Training Health & Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Live Attendance Queue</span>
              <Camera className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{pendingAtt} <span className="text-xs font-semibold text-slate-500 font-normal">photos pending</span></p>
            <p className="text-xs text-slate-500">Candidates waiting for webcam verification.</p>
            <Link to="/trainer/attendance" className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 pt-1">
              Open Camera Verification <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Lecture Schedule</span>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{schedules.length} <span className="text-xs font-semibold text-slate-500 font-normal">planned</span></p>
            <p className="text-xs text-slate-500">Curriculum topics and lab schedules.</p>
            <Link to="/trainer/schedule" className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700 hover:text-amber-900 pt-1">
              Manage Sessions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Assessment Status</span>
              <ClipboardList className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">100% <span className="text-xs font-semibold text-slate-500 font-normal">Curriculum Ready</span></p>
            <p className="text-xs text-slate-500">MCQ assessments and final exams.</p>
            <Link to="/trainer/assessment" className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-700 hover:text-blue-900 pt-1">
              View Assessments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Scheduled Sessions Timeline Overview */}
        <div className="gov-card p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-700" /> Scheduled Training Sessions &amp; Topic Modules
            </h2>
            <Link to="/trainer/schedule" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
              + Create New Session <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {schedules.length > 0 ? (
            <div className="space-y-3">
              {schedules.map((sch, idx) => (
                <div key={sch.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap justify-between items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-purple-100 text-purple-900 rounded-md">
                      {sch.date} • {sch.time}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{sch.topic}</h3>
                    <p className="text-xs text-slate-500">Duration: {sch.duration || '2 Hours'} · Candidate: <strong className="text-slate-700">{sch.candidateName || 'Assigned Batch'}</strong></p>
                  </div>
                  <Link
                    to="/trainer/attendance"
                    className="bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition"
                  >
                    View Attendance
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700">No Scheduled Sessions Yet</p>
              <p className="text-[11px] text-slate-500">Create training schedules for your enrolled batch to trigger attendance alerts.</p>
            </div>
          )}
        </div>

      </div>
    </SidebarLayout>
  );
}
