import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { PROVIDER_NAV } from "../../config/sidebarNav";
import { fetchAllCandidates } from "../../services/api";
import { GraduationCap, Briefcase, Award, CheckCircle2 } from "lucide-react";

export default function ProviderCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  useEffect(() => { fetchAllCandidates().then(setCandidates); }, []);

  return (
    <SidebarLayout sidebarItems={PROVIDER_NAV} roleName="Training Provider" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              Provider Cohort Manager
            </span>
            <h1 className="text-base font-black text-slate-900 mt-1">Enrolled Trainees & Placement Tracking</h1>
            <p className="text-xs text-slate-500">Track candidate skilling, certification, and verified post-training employment</p>
          </div>
          <span className="text-xs font-black text-purple-950 bg-purple-100 px-3.5 py-1.5 rounded-xl border border-purple-200">
            {candidates.length} Registered Trainees
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          {candidates.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-extrabold text-slate-700 text-sm">No Candidates Yet</p>
              <p className="text-xs text-slate-500">Register candidates from the Register page.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((c) => {
                const emp = c.employmentDetails || {};
                const compName = emp.company || emp.enterpriseName || (emp.napsContractId ? `NAPS: ${emp.company || "Bajaj Auto"}` : "In Skilling");
                const salaryDisp = emp.currentSalary ? `₹${emp.currentSalary.toLocaleString("en-IN")}/mo` : (emp.monthlyRevenue ? `₹${emp.monthlyRevenue.toLocaleString("en-IN")}/mo profit` : (emp.monthlyStipend ? `₹${emp.monthlyStipend.toLocaleString("en-IN")}/mo stipend` : "—"));

                return (
                  <div key={c.candidateId} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-purple-300 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-black text-base shadow shrink-0">
                          {c.name?.[0] || "?"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-slate-900 text-sm">{c.name}</h3>
                            <span className="bg-purple-100 text-purple-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {c.candidateId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {c.educationLevel} · {c.district} · <span className="text-purple-700 font-bold">{c.enrolledCourse?.title || "Vocational Course"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                          c.employmentStatus?.includes("EMPLOYED") || c.employmentStatus?.includes("ACTIVE")
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}>
                          {c.employmentStatus || "In Training"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Faculty</span>
                        <p className="font-bold text-slate-900 truncate">{c.assignedTrainer?.name || "Dr. Sameer Joshi"}</p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Outcome / Employer</span>
                        <p className="font-bold text-emerald-800 truncate">{compName}</p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Wage Progression</span>
                        <p className="font-extrabold text-slate-900">{salaryDisp}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 text-[10px] pt-1">
                      <span className="font-bold text-slate-500">Skills:</span>
                      {c.skills?.map((s) => (
                        <span key={s} className="bg-white border border-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                          {s}
                        </span>
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
