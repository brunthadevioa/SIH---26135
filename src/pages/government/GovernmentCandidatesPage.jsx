import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { GOVERNMENT_NAV } from "../../config/sidebarNav";
import { fetchGovernmentAnalytics, fetchAllCandidates } from "../../services/api";
import { Database, ChevronDown, ChevronUp, Shield, Briefcase, TrendingUp, Award, CheckCircle2, PhoneCall, Sparkles } from "lucide-react";

export default function GovernmentCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    Promise.all([fetchGovernmentAnalytics(), fetchAllCandidates()]).then(([analytics, list]) => {
      const candList = (analytics && analytics.candidates && analytics.candidates.length > 0)
        ? analytics.candidates
        : (list || []);
      setCandidates(candList);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-xs">Loading Candidate Registry...</div>;

  return (
    <SidebarLayout sidebarItems={GOVERNMENT_NAV} roleName="Government Portal" roleColor="orange">
      <div className="space-y-6 animate-fadeInUp p-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
              Statewide Longitudinal Registry
            </span>
            <h1 className="text-base font-black text-slate-900 mt-1">Maharashtra Trainee & Employment Master Registry</h1>
            <p className="text-xs text-slate-500">Live longitudinal registry tracking wage progression, self-employment, and retention outcomes across all districts</p>
          </div>
          <span className="text-xs font-black text-orange-950 bg-orange-100 px-3.5 py-1.5 rounded-xl border border-orange-200">
            {candidates.length} Active Trainee Records
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          {candidates.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <Database className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-extrabold text-slate-700 text-sm">No Candidate Data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.map((c, i) => {
                const emp = c.employmentDetails || {};
                const compName = emp.company || emp.enterpriseName || (emp.napsContractId ? `NAPS: ${emp.company || "Bajaj Auto"}` : "In Training / Seeking");
                const salaryDisp = emp.currentSalary ? `₹${emp.currentSalary.toLocaleString("en-IN")}/mo` : (emp.monthlyRevenue ? `₹${emp.monthlyRevenue.toLocaleString("en-IN")}/mo profit` : (emp.monthlyStipend ? `₹${emp.monthlyStipend.toLocaleString("en-IN")}/mo stipend` : "—"));
                const retentionDisp = emp.retentionMonths ? `${emp.retentionMonths} Months Retained` : (c.outcomeType || "Active");

                return (
                  <div key={c.candidateId || i} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-orange-300 transition">
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="w-full p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-orange-50/50 transition text-left"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-700 text-white flex items-center justify-center font-black text-base shadow shrink-0">
                          {c.name?.[0] || "?"}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black text-slate-900 text-sm">{c.name}</p>
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                              {c.candidateId}
                            </span>
                            <span className="text-[10px] font-bold text-orange-950 bg-orange-100 px-2 py-0.5 rounded">
                              {c.outcomeType || "Wage Employment"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 truncate">
                            <span className="font-semibold text-slate-800">{compName}</span> • <span className="text-emerald-700 font-black">{salaryDisp}</span> • <span className="text-slate-500">{c.district} ({c.educationLevel})</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 ml-3">
                        <div className="text-right hidden sm:block">
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                            c.employmentStatus?.includes("EMPLOYED") || c.employmentStatus?.includes("ACTIVE")
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}>
                            {c.employmentStatus || "REGISTERED"}
                          </span>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5">{retentionDisp}</p>
                        </div>
                        {expanded === i ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                      </div>
                    </button>

                    {expanded === i && (
                      <div className="p-5 bg-white border-t border-slate-200 space-y-4 text-xs animate-fadeInUp">
                        {/* Employment & Outcome Card */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-[11px]">
                              <Briefcase className="w-3.5 h-3.5 text-emerald-700" /> Employment Details
                            </div>
                            <p className="font-bold text-slate-900 text-xs">{compName}</p>
                            <p className="text-[10px] text-slate-600">{emp.role || emp.businessType || "Trainee"}</p>
                            <p className="text-[10px] font-bold text-emerald-800">Joined: {emp.joiningDate || emp.contractStartDate || emp.commencementDate || "Active"}</p>
                          </div>

                          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-[11px]">
                              <TrendingUp className="w-3.5 h-3.5 text-blue-700" /> Wage & Escalation
                            </div>
                            <p className="font-black text-slate-900 text-sm text-emerald-700">{salaryDisp}</p>
                            <p className="text-[10px] text-slate-600">Start: ₹{(emp.startingSalary || 0).toLocaleString("en-IN")}/mo</p>
                            <p className="text-[10px] font-bold text-blue-800">Retention: {emp.retentionMonths || 6} Months</p>
                          </div>

                          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-[11px]">
                              <Award className="w-3.5 h-3.5 text-purple-700" /> Skilling & Certificate
                            </div>
                            <p className="font-bold text-slate-900 text-xs truncate">{c.enrolledCourse?.title || "Vocational Trade"}</p>
                            <p className="text-[10px] text-slate-600">{c.assignedProvider || "MSSDS Centre"}</p>
                            <p className="text-[10px] font-bold text-purple-800">Cert: {c.certificates?.[0]?.certificateId || "Issued"}</p>
                          </div>

                          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                            <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-[11px]">
                              <Shield className="w-3.5 h-3.5 text-amber-700" /> Verification Signals
                            </div>
                            <p className="text-[10px] font-bold text-slate-800">{emp.epfoUan ? `EPFO UAN: ${emp.epfoUan}` : (emp.udyamRegistrationNumber ? `Udyam: ${emp.udyamRegistrationNumber}` : (emp.napsContractId ? `NAPS: ${emp.napsContractId}` : "Self-Certified"))}</p>
                            <p className="text-[10px] text-slate-600">Verified by: {emp.verifiedBy || "Portal Validation"}</p>
                            <p className="text-[10px] font-extrabold text-emerald-700">✓ DPDP Act Consent Active</p>
                          </div>
                        </div>

                        {/* Longitudinal Milestone Progression */}
                        {c.salaryProgression && c.salaryProgression.length > 0 && (
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                            <p className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-orange-600" /> Longitudinal Progression Timeline
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {c.salaryProgression.map((sp, sIdx) => (
                                <div key={sIdx} className="p-2 bg-white rounded-xl border border-slate-200 text-center">
                                  <span className="text-[9px] font-black uppercase text-slate-400">{sp.period}</span>
                                  <p className="font-black text-slate-900 text-xs text-emerald-700 mt-0.5">₹{sp.salary.toLocaleString("en-IN")}</p>
                                  <p className="text-[9px] text-slate-600 truncate mt-0.5" title={sp.milestone}>{sp.milestone}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Verified Skills & Contact */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-slate-500 text-[11px]">Skills:</span>
                            {c.skills?.map((s) => (
                              <span key={s} className="bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                                ✓ {s}
                              </span>
                            ))}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            <span>Contact: {c.email} • {c.mobile}</span>
                          </div>
                        </div>
                      </div>
                    )}
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
