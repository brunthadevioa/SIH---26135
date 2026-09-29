import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { PROVIDER_NAV } from "../../config/sidebarNav";
import { fetchAllCandidates, assignTrainer, fetchTrainers } from "../../services/api";
import { UserCheck, CheckCircle2, Users, Star, Clock, Sparkles, Filter, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProviderAssignPage() {
  const [candidates, setCandidates] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState({});
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    const [cList, tList] = await Promise.all([fetchAllCandidates(), fetchTrainers()]);
    setCandidates(cList || []);
    setTrainers(tList || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAssign = async (candidateId, trainerId) => {
    const targetTrainerId = trainerId || selectedTrainerId[candidateId] || trainers[0]?.id || "trn-01";
    const res = await assignTrainer(candidateId, targetTrainerId);
    if (res.candidate) {
      const assignedTrainer = trainers.find((t) => t.id === targetTrainerId);
      setToast(`✓ ${assignedTrainer?.name || "Trainer"} Assigned to ${res.candidate.name}!`);
      setTimeout(() => setToast(""), 4000);
      load();
    }
  };

  const handleAssignFreeTrainer = async (candidateId) => {
    const freeTrainer = trainers.find((t) => t.assignedCount === 0 || t.status?.includes("Free")) || trainers[0];
    if (freeTrainer) {
      await handleAssign(candidateId, freeTrainer.id);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.candidateId?.toLowerCase().includes(search.toLowerCase()) ||
      c.enrolledCourse?.title?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "unassigned") return !c.assignedTrainer;
    if (filter === "assigned") return !!c.assignedTrainer;
    return true;
  });

  const unassignedCount = candidates.filter((c) => !c.assignedTrainer).length;
  const assignedCount = candidates.filter((c) => !!c.assignedTrainer).length;

  return (
    <SidebarLayout sidebarItems={PROVIDER_NAV} roleName="Training Provider" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-purple-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-amber-300" /> {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              Cohort Operations
            </span>
            <h1 className="text-base font-black text-slate-900 mt-1">Candidate Trainer Allocation</h1>
            <p className="text-xs text-slate-500">Pair enrolled trainees with certified faculty matching their domain coursework</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/provider/trainers"
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-extrabold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-purple-700" /> View Faculty Roster (5 Trainers) →
            </Link>
          </div>
        </div>

        {/* Candidate Allocation Console */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by candidate, course, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={() => setFilter("all")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  filter === "all" ? "bg-purple-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All ({candidates.length})
              </button>
              <button
                onClick={() => setFilter("unassigned")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  filter === "unassigned" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Unassigned ({unassignedCount})
              </button>
              <button
                onClick={() => setFilter("assigned")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  filter === "assigned" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Assigned ({assignedCount})
              </button>
            </div>
          </div>

          {/* Candidate Allocation Cards */}
          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <p className="font-black text-slate-600 text-sm">No candidates match this filter</p>
              <p>All candidates might already be assigned or no records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCandidates.map((c) => {
                const isAssigned = !!c.assignedTrainer;
                return (
                  <div
                    key={c.candidateId}
                    className={`p-5 rounded-2xl border transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isAssigned ? "bg-white border-slate-200 hover:border-slate-300" : "bg-amber-50/40 border-amber-200"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-sm">{c.name}</h3>
                        <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                          {c.candidateId}
                        </span>
                        {isAssigned ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Assigned
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                            ⏳ Pending Allocation
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700">
                        Enrolled: <strong className="text-purple-900 font-bold">{c.enrolledCourse?.title || "Full Stack Web Architecture"}</strong>
                        {" · "}
                        <span className="text-slate-500">District: {c.district || "Pune"}</span>
                      </p>

                      <p className="text-xs text-slate-600">
                        Assigned Faculty:{" "}
                        <strong className={isAssigned ? "text-emerald-700 font-black" : "text-amber-700 font-bold"}>
                          {c.assignedTrainer?.name || "Not Assigned"}
                        </strong>
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
                      <select
                        value={selectedTrainerId[c.candidateId] || c.assignedTrainer?.id || trainers[0]?.id || "trn-01"}
                        onChange={(e) => setSelectedTrainerId({ ...selectedTrainerId, [c.candidateId]: e.target.value })}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500 shadow-xs"
                      >
                        {trainers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.assignedCount || 0} active)
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleAssign(c.candidateId, selectedTrainerId[c.candidateId])}
                        className="bg-purple-900 hover:bg-purple-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> {isAssigned ? "Reassign" : "Assign Trainer"}
                      </button>

                      {!isAssigned && (
                        <button
                          onClick={() => handleAssignFreeTrainer(c.candidateId)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Assign to first available trainer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Auto-Assign Free
                        </button>
                      )}
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
