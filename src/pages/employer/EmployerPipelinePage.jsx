import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { EMPLOYER_NAV } from "../../config/sidebarNav";
import { fetchAllCandidates, updateHRPipeline } from "../../services/api";
import { Building2, CheckCircle2, FileText } from "lucide-react";

export default function EmployerPipelinePage() {
  const [candidates, setCandidates] = useState([]);
  const [toast, setToast] = useState("");

  const load = async () => {
    const list = await fetchAllCandidates();
    setCandidates(list.filter(c => c.employmentStatus !== "Seeking Employment" || c.certificates?.length > 0));
  };
  useEffect(() => { load(); }, []);

  const handleAdvance = async (candidateId, nextStatus, salary = "₹28,000/mo") => {
    const res = await updateHRPipeline(null, nextStatus, salary, candidateId);
    if (res.candidate) {
      setToast(`✓ ${res.candidate.name} → ${nextStatus}`);
      setTimeout(() => setToast(""), 4000);
      load();
    }
  };

  return (
    <SidebarLayout sidebarItems={EMPLOYER_NAV} roleName="Employer HR Portal" roleColor="blue">
      <div className="space-y-6 animate-fadeInUp p-6">
        {toast && <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce"><CheckCircle2 className="w-5 h-5" /> {toast}</div>}

        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-base font-black text-slate-900">HR Hiring Pipeline</h1>
          <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">{candidates.length} Applications</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <p className="text-xs text-slate-500">Each candidate is verified individually. Advancing one does not change others.</p>
          {candidates.length === 0 ? (
            <div className="p-10 text-center space-y-3"><FileText className="w-10 h-10 text-slate-300 mx-auto" /><p className="font-extrabold text-slate-700 text-sm">No Applications Yet</p><p className="text-xs text-slate-500">Candidates apply from their Job Marketplace page.</p></div>
          ) : (
            <div className="space-y-4">
              {candidates.map(c => {
                const hasCamera = (c.attendanceHistory || []).length > 0;
                return (
                  <div key={c.candidateId} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-black text-lg shadow">{c.name?.[0] || "?"}</div>
                        <div>
                          <h3 className="font-black text-slate-900 text-sm">{c.name}</h3>
                          <p className="text-xs text-slate-500">{c.educationLevel} · {c.district}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black ${c.employmentStatus?.includes("EMPLOYED") ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-900 border border-amber-300"}`}>{c.employmentStatus}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="font-bold text-slate-500">Skills:</span>
                      {c.skills?.map(s => <span key={s} className="bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold px-2 py-0.5 rounded">✓ {s}</span>)}
                      <span className={`px-2.5 py-1 rounded-full font-extrabold ${hasCamera ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-200"}`}>
                        {hasCamera ? "📷 Camera Verified" : "📷 No Camera Proof"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                      <button onClick={() => handleAdvance(c.candidateId, "HR Review")} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl cursor-pointer">1. HR Review</button>
                      <button onClick={() => handleAdvance(c.candidateId, "Candidate Verified")} className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded-xl cursor-pointer">2. Verify</button>
                      <button onClick={() => handleAdvance(c.candidateId, "Offer Extended", "₹28,000/mo")} className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl cursor-pointer">3. Offer</button>
                      <button onClick={() => handleAdvance(c.candidateId, "EMPLOYED VERIFIED", "₹28,000/mo")} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow cursor-pointer flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 4. Confirm Employed</button>
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
