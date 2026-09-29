import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/SidebarLayout';
import { TRAINER_NAV } from '../../config/sidebarNav';
import { fetchAttendanceRequests, verifyAttendance } from '../../services/api';
import { Camera, CheckCircle2, Eye } from 'lucide-react';

export default function TrainerAttendancePage() {
  const [attRequests, setAttRequests] = useState([]);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [toast, setToast] = useState('');

  const load = async () => {
    const reqs = await fetchAttendanceRequests();
    setAttRequests(reqs || []);
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async (attId) => {
    const res = await verifyAttendance(attId);
    if (res.attReq) {
      setToast('✓ Camera Attendance Photo Verified! Candidate Status Updated to PRESENT.');
      setTimeout(() => setToast(''), 4000);
      load();
    }
  };

  const pending = attRequests.filter(r => r.status !== 'Verified');

  return (
    <SidebarLayout sidebarItems={TRAINER_NAV} roleName="Trainer Portal" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5" /> {toast}
          </div>
        )}

        {/* Photo Viewer Modal */}
        {viewingPhoto && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewingPhoto(null)}>
            <div className="bg-white rounded-3xl p-4 max-w-lg w-full shadow-2xl space-y-3" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900">📷 Camera Proof — Submitted by Candidate</h3>
                <button onClick={() => setViewingPhoto(null)} className="text-xs text-slate-500 font-bold cursor-pointer hover:text-slate-900">✕ Close</button>
              </div>
              <img src={viewingPhoto} alt="Camera Proof" className="w-full rounded-2xl border-2 border-emerald-400 shadow-md" />
              <p className="text-[10px] text-slate-500 text-center">Live webcam capture submitted as attendance proof</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-base font-black text-slate-900">Camera Attendance Verification</h1>
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${pending.length > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
            {pending.length} Pending Verification{pending.length !== 1 ? 's' : ''}
          </span>
        </div>

        {attRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Camera className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="font-extrabold text-slate-700 text-sm">No Attendance Submissions Yet</p>
            <p className="text-xs text-slate-500">Candidates submit live webcam photos from their Attendance page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attRequests.map(req => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  {req.photoData ? (
                    <img src={req.photoData} alt="Live Photo" className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-400 shadow cursor-pointer hover:scale-105 transition" onClick={() => setViewingPhoto(req.photoData)} />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">No Photo</div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-sm">{req.candidateName}</h4>
                    <p className="text-xs text-slate-500 font-mono">ID: {req.candidateId}</p>
                    <p className="text-[10px] text-amber-800 font-bold">{req.topic} ({req.date})</p>
                    <p className="text-[10px] text-slate-400">Submitted at: {req.time}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {req.photoData && (
                    <button onClick={() => setViewingPhoto(req.photoData)} className="text-xs text-blue-700 font-bold flex items-center gap-1 cursor-pointer hover:text-blue-900">
                      <Eye className="w-3.5 h-3.5" /> View Full Photo
                    </button>
                  )}
                  {req.status === 'Verified' ? (
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1.5 rounded-full border border-emerald-300">✓ Verified</span>
                  ) : (
                    <button onClick={() => handleVerify(req.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow cursor-pointer transition">
                      ✓ Verify Photo & Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
