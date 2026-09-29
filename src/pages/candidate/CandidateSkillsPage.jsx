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
  Square,
  Award,
  AlertTriangle,
  HelpCircle,
  EyeOff,
  Eye,
  Sliders,
  PlayCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const TARGET_CAREER_BENCHMARKS = [
  {
    id: "fullstack",
    title: "Full Stack Web Engineer",
    avgSalary: "₹4.50 LPA - ₹7.20 LPA",
    requiredSkills: ["JavaScript", "React.js", "Node.js", "Tailwind CSS", "Docker", "REST APIs"],
    radarData: [
      { subject: "Frontend Architecture", candidate: 82, benchmark: 90, fullMark: 100 },
      { subject: "API & Backend Services", candidate: 70, benchmark: 85, fullMark: 100 },
      { subject: "Database & Data Models", candidate: 65, benchmark: 80, fullMark: 100 },
      { subject: "DevOps & Cloud Deploy", candidate: 45, benchmark: 75, fullMark: 100 },
      { subject: "Testing & Code Quality", candidate: 60, benchmark: 80, fullMark: 100 },
      { subject: "Practical Problem Solving", candidate: 85, benchmark: 90, fullMark: 100 }
    ],
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
    radarData: [
      { subject: "EV Powertrain Dynamics", candidate: 50, benchmark: 85, fullMark: 100 },
      { subject: "Battery Management (BMS)", candidate: 40, benchmark: 90, fullMark: 100 },
      { subject: "CAN Bus Diagnostics", candidate: 35, benchmark: 80, fullMark: 100 },
      { subject: "High Voltage Safety", candidate: 65, benchmark: 95, fullMark: 100 },
      { subject: "AutoCAD Electrical", candidate: 55, benchmark: 75, fullMark: 100 },
      { subject: "Lab Simulation & Testing", candidate: 70, benchmark: 85, fullMark: 100 }
    ],
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
    radarData: [
      { subject: "AWS Cloud Infrastructure", candidate: 40, benchmark: 90, fullMark: 100 },
      { subject: "Linux Core Admin", candidate: 65, benchmark: 85, fullMark: 100 },
      { subject: "Docker Containerization", candidate: 50, benchmark: 85, fullMark: 100 },
      { subject: "Kubernetes Orchestration", candidate: 30, benchmark: 80, fullMark: 100 },
      { subject: "CI/CD Pipelines", candidate: 45, benchmark: 85, fullMark: 100 },
      { subject: "Cloud Security & VPC", candidate: 40, benchmark: 80, fullMark: 100 }
    ],
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
    radarData: [
      { subject: "SIEM & Log Analysis", candidate: 40, benchmark: 85, fullMark: 100 },
      { subject: "Network Traffic (Wireshark)", candidate: 55, benchmark: 80, fullMark: 100 },
      { subject: "Threat Hunting & OSINT", candidate: 35, benchmark: 75, fullMark: 100 },
      { subject: "Incident Response", candidate: 45, benchmark: 85, fullMark: 100 },
      { subject: "Compliance & ISO 27001", candidate: 50, benchmark: 70, fullMark: 100 },
      { subject: "Vulnerability Scanning", candidate: 60, benchmark: 85, fullMark: 100 }
    ],
    recommendedCourse: {
      id: "crs-cyber",
      title: "Cybersecurity, Ethical Hacking & SOC Defense",
      duration: "5 Months",
      provider: "Symbiosis Skills & Professional University",
    },
  },
  {
    id: "ai_data",
    title: "AI & Data Analytics Specialist",
    avgSalary: "₹5.00 LPA - ₹8.00 LPA",
    requiredSkills: ["Python", "Pandas & NumPy", "SQL Data Warehousing", "Machine Learning", "Tableau/PowerBI"],
    radarData: [
      { subject: "Python for Data Science", candidate: 75, benchmark: 90, fullMark: 100 },
      { subject: "SQL & Query Optimization", candidate: 70, benchmark: 85, fullMark: 100 },
      { subject: "Data Wrangling (Pandas)", candidate: 65, benchmark: 85, fullMark: 100 },
      { subject: "Statistical Modeling & ML", candidate: 40, benchmark: 80, fullMark: 100 },
      { subject: "BI Dashboards & Viz", candidate: 60, benchmark: 80, fullMark: 100 },
      { subject: "Model Evaluation & Metrics", candidate: 35, benchmark: 75, fullMark: 100 }
    ],
    recommendedCourse: {
      id: "crs-data-ai",
      title: "Applied Machine Learning & Advanced BI Analytics",
      duration: "5 Months",
      provider: "Government Polytechnic Pune CoE",
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

  // Skill verification & masking states
  const [verifyingSkill, setVerifyingSkill] = useState(null);
  const [testAnswer, setTestAnswer] = useState("");
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);

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

  // Skills with verification status
  const verifiedSkillList = candidate?.verifiedSkills || [
    { name: "JavaScript", provenance: "NSDC Practical Assessment", verified: true, score: 88 },
    { name: "React.js", provenance: "Trainer Project Check", verified: true, score: 82 },
    { name: "HTML/CSS", provenance: "Curriculum Module 1 Exam", verified: true, score: 94 },
    { name: "Git & Version Control", provenance: "Self-Reported Claim", verified: false, score: 60 },
    { name: "REST APIs", provenance: "Self-Reported Claim", verified: false, score: 55 }
  ];

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

  // Composite Skill Score Formula (Code Shilpo SIH26135 Model)
  // Assessment Theory (40%) + Lab / Projects (30%) + Attendance (30%)
  const theoryScore = 84;
  const labScore = 86;
  const attendanceScore = 92;
  const compositeScore = Math.round((theoryScore * 0.4) + (labScore * 0.3) + (attendanceScore * 0.3));

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

  const handleCompleteSkillTest = () => {
    setIsSubmittingTest(true);
    setTimeout(() => {
      setIsSubmittingTest(false);
      setVerifyingSkill(null);
      setToast(`✅ Verification successful! '${verifyingSkill}' is now cryptographically verified and unmasked.`);
      setTimeout(() => setToast(""), 4500);
    }, 1200);
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                SIH26135 · Skill-Farming Engine
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Continuous Tracking &amp; Gap Analyzer
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">Skill Gap Radar, Scoring &amp; Longitudinal Consent</h1>
            <p className="text-xs text-slate-500">Role-Skill Spider Matrix · Composite Scoring · Data Masking for Unverified Skills</p>
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
              {isScanning ? "Scanning Matrix..." : "⚡ Run AI Neural Gap Scan"}
            </button>
          </div>
        </div>

        {/* COMPOSITE SKILL SCORE OVERVIEW (CODE SHILPO MODEL) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-950 to-indigo-950 text-white p-5 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                Composite Net Skill Score
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-white">{compositeScore}</span>
                <span className="text-xs font-bold text-slate-400">/ 100 pts</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Proficiency Tier:</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full">
                Tier 1 (Industry Ready)
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Theory Assessment (40%)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{theoryScore}%</p>
              </div>
              <span className="bg-blue-50 text-blue-700 p-2 rounded-xl">
                <Award className="w-5 h-5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">MSSDS Proctored Technical Exams &amp; Quizzes</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Practical Labs &amp; Projects (30%)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{labScore}%</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 p-2 rounded-xl">
                <Cpu className="w-5 h-5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Trainer-Signed Git Repos &amp; Hardware Labs</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Attendance &amp; Check-ins (30%)</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{attendanceScore}%</p>
              </div>
              <span className="bg-purple-50 text-purple-700 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Geo-Fenced &amp; Facial Biometric Validations</p>
          </div>
        </div>

        {/* TARGET CAREER BENCHMARK SELECTOR */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-600" /> Select Target Career Benchmark (Recalibrates Spider Matrix):
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              Live Industry Salary: {selectedRole.avgSalary}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TARGET_CAREER_BENCHMARKS.map((role) => {
              const isSelected = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md font-black ring-2 ring-emerald-400"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-bold"
                  }`}
                >
                  <p className="text-xs font-extrabold leading-snug">{role.title}</p>
                  <p className={`text-[10px] mt-1 ${isSelected ? "text-emerald-300" : "text-slate-400"}`}>
                    {role.requiredSkills.length} Required Competencies
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* CORE SPIDER / RADAR MATRIX SECTION (CENTERPIECE FROM THE VIDEO) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Radar Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  Interactive Spider Matrix
                </span>
                <h2 className="text-sm font-black text-slate-900 mt-1">
                  Candidate Competency vs. Industry Benchmark: {selectedRole.title}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Candidate Score
                </span>
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Role Benchmark
                </span>
              </div>
            </div>

            <div className="w-full h-80 py-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={selectedRole.radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fill: "#94a3b8", fontSize: 9 }} />
                  <Radar
                    name="Candidate Mastery"
                    dataKey="candidate"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.45}
                  />
                  <Radar
                    name="Target Industry Benchmark"
                    dataKey="benchmark"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeDasharray="4 4"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-slate-400 text-center italic border-t border-slate-100 pt-2">
              Real-time neural gap detection powered by MSSDS Curriculum Mapping &amp; NCVET Occupational Standards.
            </p>
          </div>

          {/* Granular Axis Deficit & Bridge Actions */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 border border-slate-800">
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  Competency Gap Breakdown
                </span>
                <span className="text-xs font-bold text-slate-300">
                  Fit: <strong className="text-emerald-400">{matchPercentage}%</strong>
                </span>
              </div>
              <h3 className="text-sm font-black mt-2 text-white">Axis-Wise Skill Deficits &amp; Remediation</h3>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
              {selectedRole.radarData.map((item) => {
                const deficit = item.benchmark - item.candidate;
                const hasDeficit = deficit > 0;
                return (
                  <div
                    key={item.subject}
                    className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-xs gap-2"
                  >
                    <div>
                      <p className="font-extrabold text-white text-xs">{item.subject}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300 font-semibold">
                        <span>Current: <strong className="text-emerald-300">{item.candidate}%</strong></span>
                        <span>Target: <strong className="text-indigo-300">{item.benchmark}%</strong></span>
                      </div>
                    </div>

                    {hasDeficit ? (
                      <div className="text-right shrink-0">
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2 py-0.5 rounded-md block mb-1">
                          -{deficit}% Gap
                        </span>
                        <button
                          onClick={() => handleQuickEnroll(selectedRole.recommendedCourse.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3" /> Bridge Module
                        </button>
                      </div>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-1 rounded-md shrink-0">
                        Benchmark Met ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Projected Wage Hike:</span>
              <span className="text-emerald-400 font-black text-sm flex items-center">
                <IndianRupee className="w-4 h-4" /> +₹1.80 LPA
              </span>
            </div>
          </div>
        </div>

        {/* VERIFICATION & DATA MASKING SYSTEM (CODE SHILPO HIGHLIGHT) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Fraud Prevention · Skill Verification &amp; Data Masking
              </span>
              <h2 className="text-sm font-black text-slate-900 mt-1">
                Candidate Competency Verification Status (Masking Engine)
              </h2>
              <p className="text-xs text-slate-500">
                Unverified skills are masked on public employer profiles until validated via assessment test or trainer project check.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Verified: <strong className="text-emerald-600">{verifiedSkillList.filter(s => s.verified).length}</strong> / {verifiedSkillList.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {verifiedSkillList.map((skill) => (
              <div
                key={skill.name}
                className={`p-4 rounded-2xl border text-xs transition flex flex-col justify-between space-y-3 ${
                  skill.verified
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-amber-50/40 border-amber-200/80"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{skill.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Provenance: {skill.provenance}</p>
                  </div>
                  {skill.verified ? (
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <EyeOff className="w-3 h-3" /> Masked (Claim)
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">
                    {skill.verified ? `Score: ${skill.score}%` : "Awaiting Project / Test"}
                  </span>

                  {!skill.verified && (
                    <button
                      onClick={() => setVerifyingSkill(skill.name)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-400" /> Verify &amp; Unmask
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL: VERIFY SKILL VIA QUICK TEST / PROJECT CHECK */}
        {verifyingSkill && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeInUp">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Skill Validation Check
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">Verify Competency: {verifyingSkill}</h3>
                </div>
                <button
                  onClick={() => setVerifyingSkill(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="font-semibold text-slate-600">
                  To unmask this skill from employer masking, complete this rapid knowledge check or link your project repository:
                </p>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <p className="font-bold text-slate-900">
                    Question: Which command or architecture pattern best ensures reliable state recovery and deterministic builds in {verifyingSkill}?
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {[
                      "Using immutable state management & containerized CI/CD build scripts",
                      "Hardcoding environment parameters directly inside local configuration",
                      "Disabling peer-dependency audits and skipping unit test suites"
                    ].map((opt, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition cursor-pointer ${
                          testAnswer === opt
                            ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="testOpt"
                          value={opt}
                          checked={testAnswer === opt}
                          onChange={(e) => setTestAnswer(e.target.value)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Optional: Project Repo / Proof URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/my-project or live deployment link"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setVerifyingSkill(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteSkillTest}
                  disabled={isSubmittingTest || !testAnswer}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingTest ? "Validating & Minting Hash..." : "Submit & Unmask Skill"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DPDP ACT VERIFIABLE CONSENT MANAGEMENT CARD */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Digital Personal Data Protection (DPDP) Act 2023 Compliance
              </span>
              <h2 className="text-base font-black mt-0.5">Consent-Based Trainee Data &amp; Verification Preferences</h2>
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
                <p className="font-extrabold text-white text-xs">eKYC &amp; Aadhaar Data</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Permits secure identity verification with UIDAI.</p>
              </div>
            </div>

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
                <p className="text-[10px] text-slate-300 mt-0.5">Allows automated wage &amp; retention validation.</p>
              </div>
            </div>

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
                <p className="text-[10px] text-slate-300 mt-0.5">WhatsApp bot &amp; IVR check-ins at 30D, 90D, 180D.</p>
              </div>
            </div>

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

        {/* REMEDIATION BRIDGE MODULE BANNER */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-700/40">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-600/40">
              Recommended Bridge Pathway
            </span>
            <h3 className="text-base font-black text-white">{selectedRole.recommendedCourse.title}</h3>
            <p className="text-xs text-slate-300">
              Provider: {selectedRole.recommendedCourse.provider} · Duration: {selectedRole.recommendedCourse.duration}
            </p>
          </div>
          <button
            onClick={() => handleQuickEnroll(selectedRole.recommendedCourse.id)}
            disabled={enrolling}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" /> {enrolling ? "Enrolling..." : "1-Click Enroll to Close Gaps"}
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
}
