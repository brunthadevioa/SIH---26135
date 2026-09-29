import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/SidebarLayout';
import { TRAINER_NAV } from '../../config/sidebarNav';
import { fetchAllCandidates } from '../../services/api';
import { BookOpen } from 'lucide-react';

export default function TrainerCandidatesPage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchAllCandidates().then(list => {
      setCandidates(list.filter(c => c.assignedTrainer?.id === 'trn-01' || c.trainingStatus !== 'Not Enrolled'));
    });
  }, []);

  return (
    <SidebarLayout sidebarItems={TRAINER_NAV} roleName="Trainer Portal" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <h1 className="text-base font-black text-slate-900">My Assigned Candidates</h1>
          <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
            {candidates.length} Candidate{candidates.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          {candidates.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-extrabold text-slate-700 text-sm">No Candidates Assigned Yet</p>
              <p className="text-xs text-slate-500">Assign a trainer to a candidate from the Provider Dashboard to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map(c => {
                const hasPhoto = (c.attendanceHistory || []).length > 0;
                return (
                  <div key={c.candidateId} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-black text-base shadow shrink-0">
                          {c.name?.[0] || '?'}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-sm">{c.name}</h3>
                          <p className="text-xs text-slate-500">{c.educationLevel} · {c.district}</p>
                        </div>
                      </div>
                      <span className="badge-info text-xs shrink-0">{c.trainingStatus}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Camera Proof</p>
                        <p className="font-extrabold text-slate-800 mt-0.5">
                          {hasPhoto ? `📷 ${c.attendanceHistory.length} Photo Logged` : '📷 Not Submitted'}
                        </p>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Assessment</p>
                        <p className="font-extrabold text-slate-800 mt-0.5">
                          {c.assessmentsCompleted?.length > 0 ? `Passed (${c.assessmentsCompleted[0].score})` : 'Not Scheduled'}
                        </p>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Certificate</p>
                        <p className="font-extrabold text-emerald-700 mt-0.5">
                          {c.certificates?.length > 0 ? '✓ Issued' : 'Pending'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1 text-[10px]">
                      <span className="font-bold text-slate-500">Skills:</span>
                      {c.skills?.map(s => (
                        <span key={s} className="bg-white border border-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
