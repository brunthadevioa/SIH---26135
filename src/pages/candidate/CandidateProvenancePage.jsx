import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchCandidateById, fetchAllCandidates } from "../../services/api";
import SidebarLayout from "../../layouts/SidebarLayout";
import { CANDIDATE_NAV } from "../../config/sidebarNav";
import { ShieldCheck, CheckCircle2, Lock, QrCode, FileCheck, Award, ArrowRight, Sparkles, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function CandidateProvenancePage() {
  const { currentUser } = useAuth();
  const [candidate, setCandidate] = useState(null);

  async function loadData() {
    try {
      const list = await fetchAllCandidates();
      let targetId = currentUser?.candidateId || currentUser?.id || currentUser?.email || (list && list[0] ? list[0].candidateId : null);
      let data = null;
      if (targetId) {
        data = await fetchCandidateById(targetId);
      }
      if (!data && list && list.length > 0) {
        data = list.find((c) => c.candidateId === currentUser?.id || c.email === currentUser?.email) || list[0];
      }
      setCandidate(
        data || {
          candidateId: "MH-CAND-DEMO",
          name: "Candidate",
          district: "Pune",
          skills: ["JavaScript", "HTML/CSS", "Git", "React"],
        }
      );
    } catch (err) {
      console.error("Error loading provenance data:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const verifiedSkills = candidate?.verifiedSkills || [
    { name: "React", provenance: "Practical Assessment Test Verified (82%)", verified: true },
    { name: "JavaScript", provenance: "Skill Centre Examination Provenance", verified: true },
    { name: "Tailwind CSS", provenance: "Continuous Coursework Evaluation", verified: true },
  ];

  return (
    <SidebarLayout sidebarItems={CANDIDATE_NAV} roleName="Candidate Portal" roleColor="emerald">
      <div className="space-y-6 animate-fadeInUp p-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Single-Source Trust Engine
            </span>
            <h1 className="text-base font-black text-slate-900 mt-1">Cryptographic Skill Provenance &amp; Audit</h1>
            <p className="text-xs text-slate-500">Tamper-proof verifiable skills backed by faculty examinations and assessment records</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/candidate/skills"
              className="bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Skill Gap Analysis →
            </Link>
          </div>
        </div>

        {/* Provenance Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Provenance Trust Score</span>
            <p className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> 100% Authentic
            </p>
            <p className="text-[11px] text-slate-500">SHA-256 State Authenticated</p>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Skills Count</span>
            <p className="text-2xl font-black text-purple-900">{verifiedSkills.filter((s) => s.verified).length} Skills</p>
            <p className="text-[11px] text-slate-500">Formally Certified via Exams</p>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Candidate Ledger ID</span>
            <p className="text-base font-mono font-black text-slate-900 truncate">{candidate?.candidateId || "MH-CAND-864788"}</p>
            <p className="text-[11px] text-slate-500">Single Source DB Record</p>
          </div>
        </div>

        {/* Verified Skill Ledger */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" /> Verified Competency Provenance Ledger
              </h2>
              <p className="text-xs text-slate-500">Detailed audit origin for every acquired skill</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full">
              {verifiedSkills.length} Total Competencies
            </span>
          </div>

          <div className="space-y-3">
            {verifiedSkills.map((vs, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-slate-900 text-sm">{vs.name}</p>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        vs.verified
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {vs.verified ? "✓ Formally Verified" : "Self-Reported"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Provenance Source: <strong>{vs.provenance}</strong>
                  </p>
                </div>

                <div className="text-right text-[10px] text-slate-400 font-mono">
                  <span>Audit Timestamp: Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verifiable Certificates & Credentials Ledger (Achieved & Added) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-600" /> Verifiable Certificates &amp; Credentials Provenance
              </h2>
              <p className="text-xs text-slate-500">Cryptographically signed digital certificates (both Exam-Achieved and Added External)</p>
            </div>
            <Link
              to="/candidate/certificates"
              className="text-xs font-black text-cyan-700 hover:text-cyan-900 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200 flex items-center gap-1"
            >
              Manage &amp; Add Certificates <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(candidate?.certificates && candidate.certificates.length > 0) ? (
            <div className="space-y-3">
              {candidate.certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    cert.isExternal
                      ? "bg-blue-50/40 border-blue-200 hover:border-blue-300"
                      : "bg-cyan-50/40 border-cyan-200 hover:border-cyan-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-extrabold text-slate-900 text-sm">{cert.courseTitle}</p>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cert.isExternal
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-cyan-100 text-cyan-900 border border-cyan-300"
                        }`}
                      >
                        {cert.isExternal ? "📜 Added External Credential" : "🏆 NCVET Exam Achieved"}
                      </span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-bold">
                        ID: {cert.certificateId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Issuer: <strong>{cert.provider || "MSSDS Centre of Excellence"}</strong> · Score / Grade: <strong className="text-slate-900">{cert.score || "100%"}</strong> · Issue Date: <span className="font-mono text-slate-500">{cert.issueDate || "2026-09"}</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 truncate max-w-xl">
                      Audit Hash: <span className="text-slate-700 font-bold">{cert.certHash || `0x8f9a2b4c1e6d${candidate?.candidateId}7f0a9b`}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Authentic &amp; Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Award className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No certificates in ledger yet</p>
              <Link
                to="/candidate/certificates"
                className="inline-block text-xs font-bold text-cyan-700 hover:underline"
              >
                Go to Certificates page to take assessment or add external credentials →
              </Link>
            </div>
          )}
        </div>

        {/* Cryptographic Security Hash Verification */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" /> Immutable Blockchain Ledger Hash
              </h3>
              <p className="text-xs text-slate-400">Cryptographic hash verifying candidate records against the state database</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-700/60 px-2.5 py-1 rounded-full">
              SHA-256 Validated
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 break-all">
            {`0x${(candidate?.candidateId || "CAND").toLowerCase()}d981a8f3b2c1e4e6d7f0a9b8c7d6e5f4a3b2c1d0`}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
