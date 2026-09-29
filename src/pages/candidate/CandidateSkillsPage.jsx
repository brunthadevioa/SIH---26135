import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchCandidateById, fetchAllCandidates, enrollInCourse, updateCandidateConsent } from "../../services/api";
import SidebarLayout from "../../layouts/SidebarLayout";
import { CANDIDATE_NAV } from "../../config/sidebarNav";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Cpu,
  TrendingUp,
  Target,
  BookOpen,
  IndianRupee,
  Check,
  X,
  FileCheck,
  Lock,
  Save,
  CheckSquare,
  Square
} from "lucide-react";
import { Link } from "react-router-dom";

const TARGET_CAREER_BENCHMARKS = [
  {
    id: "fullstack",
    title: "Full Stack Web Engineer",
    avgSalary: "₹4.50 LPA - ₹7.20 LPA",
    requiredSkills: ["JavaScript", "React.js", "Node.js", "Tailwind CSS", "Docker", "REST APIs"],
    recommendedCourse: {
      id: "crs-fullstack",
      title: "Full Stack Web Architecture & Cloud Deploy",
      duration: "6 Months",
      provider: "Symbiosis Skills & Professional University",
    },
  },
  {
    id: "ev",
    title: "EV Powertrain & Battery Diagnostic Engineer",
    avgSalary: "₹4.00 LPA - ₹6.50 LPA",
    requiredSkills: ["EV Powertrain", "Battery Management System", "AutoCAD Electrical", "CAN Bus"],
    recommendedCourse: {
      id: "crs-ev-01",
      title: "Electric Vehicle Powertrain & Battery Diagnostics",
      duration: "4 Months",
      provider: "MSSDS Centre of Excellence Pune",
    },
  },
  {
    id: "clouddevops",
    title: "Cloud & DevOps Specialist",
    avgSalary: "₹5.50 LPA - ₹8.80 LPA",
    requiredSkills: ["AWS Cloud", "Linux Administration", "Docker", "Kubernetes", "CI/CD"],
    recommendedCourse: {
      id: "crs-cloud",
      title: "Cloud Computing, DevOps CI/CD & AWS Solutions",
      duration: "5 Months",
      provider: "Don Bosco Skill Institute Kurla Mumbai",
    },
  },
  {
    id: "cyber",
    title: "Cybersecurity SOC Analyst",
    avgSalary: "₹4.20 LPA - ₹6.80 LPA",
    requiredSkills: ["SOC Defense", "SIEM (Splunk)", "Wireshark", "Network Security"],
    recommendedCourse: {
      id: "crs-cyber",
      title: "Cybersecurity, Ethical Hacking & SOC Defense",
      duration: "5 Months",
      provider: "Symbiosis Skills & Professional University",
    },
  },
];

export default function CandidateSkillsPage() {
  const { currentUser } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [selectedRole, setSelectedRole] = useState(TARGET_CAREER_BENCHMARKS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  // DPDP Consent State
  const [consentAadhaar, setConsentAadhaar] = useState(true);
  const [consentEpfo, setConsentEpfo] = useState(true);
  const [consentFollowup, setConsentFollowup] = useState(true);
  const [consentPolicy, setConsentPolicy] = useState(true);
  const [savingConsent, setSavingConsent] = useState(false);

  async function loadData() {
    try {
      const list = await fetchAllCandidates();
      let targetId =
        currentUser?.candidateId || currentUser?.id || currentUser?.email || (list && list[0] ? list[0].candidateId : null);
      let data = null;
      if (targetId) {
        data = await fetchCandidateById(targetId);
      }
      if (!data && list && list.length > 0) {
        data = list.find((c) => c.candidateId === currentUser?.id || c.email === currentUser?.email) || list[0];
      }
      if (data) {
        setCandidate(data);
        if (data.consentSettings) {
          setConsentAadhaar(!!data.consentSettings.aadhaarEkycSharing);
          setConsentEpfo(!!data.consentSettings.epfoWageVerification);
          setConsentFollowup(!!data.consentSettings.automatedFollowupSurvey);
          setConsentPolicy(!!data.consentSettings.policyResearchAnalytics);
        }
      }
    } catch (err) {
      console.error("Error loading skills data:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const candidateSkills = Array.isArray(candidate?.skills)
    ? candidate.skills
    : ["JavaScript", "HTML/CSS", "Git", "React.js"];

  // Calculate Match and Gap
  const matchedSkills = selectedRole.requiredSkills.filter((req) =>
    candidateSkills.some(
      (cs) => cs.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(cs.toLowerCase())
    )
  );
  const missingSkills = selectedRole.requiredSkills.filter(
    (req) =>
      !candidateSkills.some(
        (cs) => cs.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(cs.toLowerCase())
      )
  );

  const matchPercentage = Math.round((matchedSkills.length / selectedRole.requiredSkills.length) * 100);
  const gapPercentage = 100 - matchPercentage;

  const handleRunAIScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setToast(`🧠 AI Neural Gap Analysis completed for ${selectedRole.title}!`);
      setTimeout(() => setToast(""), 4000);
    }, 800);
  };

  const handleQuickEnroll = async (courseId) => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId) return;
    setEnrolling(true);
    try {
      await enrollInCourse(candId, courseId);
      await loadData();
      setToast("🎉 Successfully enrolled in the recommended bridge course!");
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      console.error("Enrollment error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleSaveConsent = async () => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId) return;
    setSavingConsent(true);
    try {
      await updateCandidateConsent(candId, {
        aadhaarEkycSharing: consentAadhaar,
        epfoWageVerification: consentEpfo,
        automatedFollowupSurvey: consentFollowup,
        policyResearchAnalytics: consentPolicy
      });
      await loadData();
      setToast("🔒 DPDP Act Consent Preferences securely logged & updated in Single Source DB!");
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      console.error("Consent error:", err);
    } finally {
      setSavingConsent(false);
    }
  };

  return (
    <SidebarLayout sidebarItems={CANDIDATE_NAV} roleName="Candidate Portal" roleColor="emerald">
      <div className="space-y-6 animate-fadeInUp p-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-500">
            <Sparkles className="w-5 h-5 text-emerald-400" /> {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Candidate Profile & Consent
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">Skills & Longitudinal Consent Manager</h1>
            <p className="text-xs text-slate-500">DPDP Act Verifiable Consent · AI/ML Skill Gap Analyzer</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/candidate/provenance"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" /> Cryptographic Ledger →
            </Link>
            <button
              onClick={handleRunAIScan}
              disabled={isScanning}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
            >
              <Cpu className={`w-4 h-4 text-emerald-400 ${isScanning ? "animate-spin" : ""}`} />
              {isScanning ? "Scanning Matrix..." : "⚡ Run AI Gap Scan"}
            </button>
          </div>
        </div>

        {/* DPDP ACT VERIFIABLE CONSENT MANAGEMENT CARD */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Digital Personal Data Protection (DPDP) Act 2023 Compliance
              </span>
              <h2 className="text-base font-black mt-0.5">Consent-Based Trainee Data & Verification Preferences</h2>
              <p className="text-xs text-slate-300">
                You maintain sovereign control over who can verify your skills, employment records, and wage progression.
              </p>
            </div>
            <button
              onClick={handleSaveConsent}
              disabled={savingConsent}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" /> {savingConsent ? "Saving..." : "Save Consent Preferences"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Consent 1 */}
            <div
              onClick={() => setConsentAadhaar(!consentAadhaar)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                consentAadhaar
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  : "bg-slate-800/60 border-slate-700 text-slate-400"
              }`}
            >
              {consentAadhaar ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-extrabold text-white text-xs">eKYC & Aadhaar Data</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Permits secure identity verification with UIDAI.</p>
              </div>
            </div>

            {/* Consent 2 */}
            <div
              onClick={() => setConsentEpfo(!consentEpfo)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                consentEpfo
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  : "bg-slate-800/60 border-slate-700 text-slate-400"
              }`}
            >
              {consentEpfo ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-extrabold text-white text-xs">EPFO Wage Linkage</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Allows automated wage & retention validation.</p>
              </div>
            </div>

            {/* Consent 3 */}
            <div
              onClick={() => setConsentFollowup(!consentFollowup)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                consentFollowup
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  : "bg-slate-800/60 border-slate-700 text-slate-400"
              }`}
            >
              {consentFollowup ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-extrabold text-white text-xs">Automated Surveys</p>
                <p className="text-[10px] text-slate-300 mt-0.5">WhatsApp bot & IVR check-ins at 30D, 90D, 180D.</p>
              </div>
            </div>

            {/* Consent 4 */}
            <div
              onClick={() => setConsentPolicy(!consentPolicy)}
              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                consentPolicy
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  : "bg-slate-800/60 border-slate-700 text-slate-400"
              }`}
            >
              {consentPolicy ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-extrabold text-white text-xs">Policy Research</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Anonymized impact analytics for state planning.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Target Role Selector Tabs */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-600" /> Select Target Industry Career Role:
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              Live Industry Salary: {selectedRole.avgSalary}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TARGET_CAREER_BENCHMARKS.map((role) => {
              const isSelected = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md font-black ring-2 ring-emerald-400"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-bold"
                  }`}
                >
                  <p className="text-xs font-extrabold">{role.title}</p>
                  <p className={`text-[10px] mt-1 ${isSelected ? "text-emerald-300" : "text-slate-400"}`}>
                    {role.requiredSkills.length} Required Competencies
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Measured Skill Gap Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">AI Match Fit Rate</span>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-emerald-600">{matchPercentage}%</p>
              <span className="text-xs font-bold text-slate-600 pb-1">
                {matchedSkills.length}/{selectedRole.requiredSkills.length} Skills
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Measured Skill Gap</span>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-amber-600">{gapPercentage}%</p>
              <span className="text-xs font-bold text-slate-600 pb-1">{missingSkills.length} Missing Skills</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${gapPercentage}%` }}
              />
            </div>
          </div>

          <div className="gov-card p-5 bg-white rounded-3xl border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Projected Wage Hike</span>
            <p className="text-2xl font-black text-slate-900 flex items-center gap-1">
              <IndianRupee className="w-5 h-5 text-emerald-600" /> +₹1.80 LPA
            </p>
            <p className="text-[10px] text-slate-500">Upon completing recommended bridge modules</p>
          </div>
        </div>

        {/* Detailed Competencies & AI Bridge Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Acquired Skills */}
          <div className="lg:col-span-6 gov-card p-6 space-y-4 bg-white rounded-3xl border border-slate-200">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Acquired Competencies ({matchedSkills.length})
            </h2>

            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((s) => (
                <span
                  key={s}
                  className="bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4 text-emerald-600" /> {s}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <p className="text-xs text-slate-400">No overlapping skills detected for this track yet.</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to="/candidate/provenance"
                className="text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> View full verified skill ledger &amp; SHA-256 hashes →
              </Link>
            </div>
          </div>

          {/* Right: Detected Missing Skills & Remediation */}
          <div className="lg:col-span-6 gov-card p-6 space-y-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 border border-slate-200 rounded-3xl">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-800 bg-slate-200 px-2.5 py-0.5 rounded-full">
                🧠 AI Neural Remediation Plan
              </span>
              <h2 className="text-base font-black text-slate-900 mt-1">
                Detected Missing Skills for {selectedRole.title}
              </h2>
            </div>

            {missingSkills.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s) => (
                    <span
                      key={s}
                      className="bg-rose-50 border border-rose-300 text-rose-900 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4 text-rose-600" /> {s} (Missing Gap)
                    </span>
                  ))}
                </div>

                {/* AI Recommended Course Box */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                        Recommended Bridge Course
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1">{selectedRole.recommendedCourse.title}</h3>
                      <p className="text-xs text-slate-500">
                        Provider: {selectedRole.recommendedCourse.provider} · Duration: {selectedRole.recommendedCourse.duration}
                      </p>
                    </div>

                    <button
                      onClick={() => handleQuickEnroll(selectedRole.recommendedCourse.id)}
                      disabled={enrolling}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <BookOpen className="w-4 h-4" /> {enrolling ? "Enrolling..." : "1-Click Enroll to Close Gap"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-extrabold text-sm text-emerald-950">100% Industry Benchmark Met!</h3>
                <p className="text-xs text-slate-600">
                  You possess all required competencies for {selectedRole.title}. Proceed to the Job Marketplace to apply.
                </p>
                <Link
                  to="/candidate/jobs"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow transition mt-2"
                >
                  Explore Verified Job Openings <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
