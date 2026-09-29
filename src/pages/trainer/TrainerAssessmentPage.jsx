import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/SidebarLayout';
import { TRAINER_NAV } from '../../config/sidebarNav';
import { fetchAllCandidates, createAssessment } from '../../services/api';
import { ClipboardList, CheckCircle2 } from 'lucide-react';

export default function TrainerAssessmentPage() {
  const [candidates, setCandidates] = useState([]);
  const [toast, setToast] = useState('');
  const [asmTitle, setAsmTitle] = useState('React Fundamentals & State Evaluation');
  const [schDate, setSchDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCandId, setSelectedCandId] = useState('');

  useEffect(() => {
    fetchAllCandidates().then(list => {
      const assigned = list.filter(c => c.assignedTrainer?.id === 'trn-01' || c.trainingStatus !== 'Not Enrolled');
      setCandidates(assigned);
      if (assigned.length > 0) setSelectedCandId(assigned[0].candidateId);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandId) return;
    const res = await createAssessment({ candidateId: selectedCandId, title: asmTitle, date: schDate, time: '02:00 PM', totalMarks: 100 });
    if (res.assessment) {
      setToast(`📝 Assessment '${res.assessment.title}' Scheduled!`);
      setTimeout(() => setToast(''), 4000);
    }
  };

  return (
    <SidebarLayout sidebarItems={TRAINER_NAV} roleName="Trainer Portal" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" /> {toast}
          </div>
        )}

        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-base font-black text-slate-900">Schedule Assessment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">📝 Assessment Creation</span>
              <h2 className="text-sm font-black text-slate-900 mt-1">Schedule Candidate Assessment</h2>
              <p className="text-xs text-slate-500">Passing the test triggers automatic certificate issuance.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Candidate *</label>
                <select value={selectedCandId} onChange={e => setSelectedCandId(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900">
                  {candidates.map(c => <option key={c.candidateId} value={c.candidateId}>{c.name} ({c.candidateId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assessment Name *</label>
                <input type="text" value={asmTitle} onChange={e => setAsmTitle(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date *</label>
                <input type="date" value={schDate} onChange={e => setSchDate(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total Marks</p>
                  <p className="font-black text-slate-900">100</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Pass Score</p>
                  <p className="font-black text-emerald-700">70%</p>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-3 rounded-xl shadow-md cursor-pointer text-xs">
                Schedule Assessment & Notify Candidate
              </button>
            </form>
          </div>

          {/* Info Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" /> Assessment Status by Candidate
            </h2>
            {candidates.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No candidates assigned yet.</div>
            ) : (
              <div className="space-y-3">
                {candidates.map(c => (
                  <div key={c.candidateId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <p className="font-black text-slate-900">{c.name}</p>
                      <p className="text-slate-500">{c.candidateId}</p>
                    </div>
                    <span className={`font-extrabold px-2 py-1 rounded-lg text-[10px] ${c.assessmentsCompleted?.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {c.assessmentsCompleted?.length > 0 ? `✓ Passed (${c.assessmentsCompleted[0].score})` : 'Not Scheduled'}
                    </span>
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
