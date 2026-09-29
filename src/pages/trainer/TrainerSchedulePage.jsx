import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/SidebarLayout';
import { TRAINER_NAV } from '../../config/sidebarNav';
import { fetchAllCandidates, createSchedule, fetchTrainerSchedules } from '../../services/api';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function TrainerSchedulePage() {
  const [candidates, setCandidates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [toast, setToast] = useState('');
  const [topic, setTopic] = useState('React Fundamentals & Component Architecture');
  const [schDate, setSchDate] = useState(new Date().toISOString().split('T')[0]);
  const [schTime, setSchTime] = useState('10:00 AM');
  const [selectedCandId, setSelectedCandId] = useState('');

  const load = async () => {
    const [list, schList] = await Promise.all([fetchAllCandidates(), fetchTrainerSchedules('trn-01')]);
    const assigned = list.filter(c => c.assignedTrainer?.id === 'trn-01' || c.trainingStatus !== 'Not Enrolled');
    setCandidates(assigned);
    if (assigned.length > 0 && !selectedCandId) setSelectedCandId(assigned[0].candidateId);
    setSchedules(schList || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandId) return;
    const res = await createSchedule({ trainerId: 'trn-01', candidateId: selectedCandId, topic, date: schDate, time: schTime, duration: '2 Hours', location: 'Online Live Classroom (Zoom / Teams)' });
    if (res.schedule) {
      setToast(`📅 Schedule Created for '${res.schedule.topic}'!`);
      setTimeout(() => setToast(''), 4000);
      load();
    }
  };

  return (
    <SidebarLayout sidebarItems={TRAINER_NAV} roleName="Trainer Portal" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-amber-500 text-slate-950 text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" /> {toast}
          </div>
        )}

        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-base font-black text-slate-900">Create Training Schedule</h1>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{schedules.length} Sessions Created</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">📅 Schedule Engine</span>
              <h2 className="text-sm font-black text-slate-900 mt-1">New Training Session</h2>
              <p className="text-xs text-slate-500">Enter topic, candidate, date and time manually.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Candidate *</label>
                <select value={selectedCandId} onChange={e => setSelectedCandId(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900">
                  {candidates.map(c => <option key={c.candidateId} value={c.candidateId}>{c.name} ({c.candidateId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Session Topic *</label>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                  <input type="date" value={schDate} onChange={e => setSchDate(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Time *</label>
                  <input type="text" value={schTime} onChange={e => setSchTime(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900" />
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-md cursor-pointer text-xs">
                Create Schedule & Notify Candidate
              </button>
            </form>
          </div>

          {/* Existing Schedules */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> Existing Sessions
            </h2>
            {schedules.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 text-slate-200 mx-auto" />
                <p>No sessions created yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map(s => (
                  <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <p className="font-black text-slate-900">{s.topic}</p>
                    <p className="text-slate-500">{s.date} at {s.time} · {s.duration}</p>
                    <p className="text-slate-400">{s.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
