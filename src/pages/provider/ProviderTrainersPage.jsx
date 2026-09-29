import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { PROVIDER_NAV } from "../../config/sidebarNav";
import { fetchTrainers, fetchAllCandidates } from "../../services/api";
import { Users, Star, Award, BookOpen, Clock, ShieldCheck, CheckCircle2, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProviderTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadData = async () => {
    const [tList, cList] = await Promise.all([fetchTrainers(), fetchAllCandidates()]);
    setTrainers(tList || []);
    setCandidates(cList || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTrainers = trainers.filter((trn) => {
    const matchesSearch =
      trn.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trn.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const isFree = trn.assignedCount === 0 || trn.status?.includes("Free");
    if (filterStatus === "free") return matchesSearch && isFree;
    if (filterStatus === "assigned") return matchesSearch && !isFree;
    return matchesSearch;
  });

  return (
    <SidebarLayout sidebarItems={PROVIDER_NAV} roleName="Training Provider" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              Faculty Management
            </span>
            <h1 className="text-base font-black text-slate-900 mt-1">Certified Trainers Roster</h1>
            <p className="text-xs text-slate-500">Domain-certified faculty profiles, real-time workload, and qualifications</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/provider/assign"
              className="bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Allocate Candidates →
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search faculty by name or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterStatus === "all" ? "bg-purple-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All (5)
            </button>
            <button
              onClick={() => setFilterStatus("free")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterStatus === "free" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Free / Available (4)
            </button>
            <button
              onClick={() => setFilterStatus("assigned")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterStatus === "assigned" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              In Session (1)
            </button>
          </div>
        </div>

        {/* 5 Trainer Full Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrainers.map((trn) => {
            const isFree = trn.assignedCount === 0 || trn.status?.includes("Free");
            const assignedList = candidates.filter((c) => c.assignedTrainer?.id === trn.id || c.assignedTrainer?.name === trn.name);

            return (
              <div
                key={trn.id}
                className="gov-card p-6 bg-white rounded-3xl border border-slate-200 space-y-4 hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        isFree ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {isFree ? "● Available for Allocation" : "● Active Batch In Session"}
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {trn.rating || 4.9} / 5.0
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900 text-base">{trn.name}</h3>
                    <p className="text-xs text-purple-900 font-bold bg-purple-50 p-2 rounded-xl border border-purple-100 mt-1">
                      {trn.specialization}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[9px] uppercase">Experience</span>
                      <span className="font-extrabold text-slate-800">{trn.experience || "8+ Years"}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold block text-[9px] uppercase">Active Load</span>
                      <span className="font-extrabold text-purple-900">{trn.assignedCount || assignedList.length} Trainees</span>
                    </div>
                  </div>

                  {assignedList.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Assigned Trainees</span>
                      <div className="flex flex-wrap gap-1">
                        {assignedList.map((c) => (
                          <span key={c.candidateId} className="bg-purple-100 text-purple-900 font-bold text-[10px] px-2 py-0.5 rounded-md">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> State Certified
                  </span>
                  <Link
                    to="/provider/assign"
                    className="text-xs font-extrabold text-purple-700 hover:text-purple-900 hover:underline"
                  >
                    Assign Candidates →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}
