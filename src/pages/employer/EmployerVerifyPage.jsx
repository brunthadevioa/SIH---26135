import React, { useState } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { EMPLOYER_NAV } from "../../config/sidebarNav";
import { verifyCertificateHR, verifyEmployerCredentials } from "../../services/api";
import AICertificateScannerModal from "../../components/AICertificateScannerModal";
import {
  Search, CheckCircle2, AlertCircle, Cpu, ShieldCheck,
  Building2, CheckCircle, Award, Layers, Shield,
  UserCheck, Clock, FileCheck, ThumbsUp, XCircle, AlertTriangle, Sparkles, Filter
} from "lucide-react";

const INITIAL_PLACEMENT_QUEUE = [
  {
    id: "pl-01",
    candidateId: "MH-CAND-878366",
    candidateName: "Rahul Patil",
    scheme: "MSSDS Fast-Track Skilling (Pune Cluster)",
    jobRole: "EV Powertrain Diagnostic Engineer",
    reportedJoiningDate: "2026-06-15",
    reportedSalary: "₹32,000 / month",
    epfoUan: "101928374650",
    checkpoint: "Day 90 Follow-Up",
    status: "PENDING_VALIDATION", // PENDING_VALIDATION, VERIFIED, ATTRITION, DISCREPANCY
    proofDocument: "OfferLetter_Rahul_Patil.pdf"
  },
  {
    id: "pl-02",
    candidateId: "MH-CAND-552190",
    candidateName: "Priyanka Deshmukh",
    scheme: "Pramod Mahajan Kaushalya Vikas Abhiyan",
    jobRole: "Full Stack Junior Developer",
    reportedJoiningDate: "2026-07-01",
    reportedSalary: "₹28,500 / month",
    epfoUan: "101294819203",
    checkpoint: "Day 30 Follow-Up",
    status: "VERIFIED",
    proofDocument: "JoiningReport_Priyanka.pdf",
    verifiedAt: "2026-07-28"
  },
  {
    id: "pl-03",
    candidateId: "MH-CAND-771204",
    candidateName: "Sneha Kulkarni",
    scheme: "NAPS Apprenticeship Scheme",
    jobRole: "Quality Control & Metrology Assistant",
    reportedJoiningDate: "2026-04-10",
    reportedSalary: "₹18,000 / month",
    epfoUan: "101883920194",
    checkpoint: "Day 180 Follow-Up",
    status: "PENDING_VALIDATION",
    proofDocument: "ApprenticeContract_Sneha.pdf"
  }
];

export default function EmployerVerifyPage() {
  const [activeTab, setActiveTab] = useState("followup"); // "followup", "employer", or "certificate"
  
  // Follow-up Queue State
  const [placementQueue, setPlacementQueue] = useState(INITIAL_PLACEMENT_QUEUE);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [attritionModalItem, setAttritionModalItem] = useState(null);
  const [attritionReason, setAttritionReason] = useState("Relocated to hometown / family commitments");
  const [toastMsg, setToastMsg] = useState("");

  // Employer Verification State
  const [employerName, setEmployerName] = useState("Tata Motors Ltd");
  const [gstin, setGstin] = useState("27AAACT2727Q1ZW");
  const [cin, setCin] = useState("L28920MH1945PLC004520");
  const [epfoCode, setEpfoCode] = useState("MH/BAN/0001234/000");
  const [empResult, setEmpResult] = useState(null);
  const [empLoading, setEmpLoading] = useState(false);

  // Certificate Verification State
  const [certQuery, setCertQuery] = useState("CERT-MH-EV-8821");
  const [certResult, setCertResult] = useState(null);
  const [showAIScanner, setShowAIScanner] = useState(false);

  const handleVerifyEmployer = async (e) => {
    e.preventDefault();
    setEmpLoading(true);
    setEmpResult(null);
    const res = await verifyEmployerCredentials({
      employerName,
      gstin,
      cin,
      epfoCode
    });
    setEmpResult(res);
    setEmpLoading(false);
  };

  const handleVerifyCert = async (e) => {
    e.preventDefault();
    setCertResult(null);
    if (!certQuery.trim()) return;
    const res = await verifyCertificateHR(certQuery.trim());
    setCertResult(res);
  };

  const handleConfirmEmployment = (id, candidateName) => {
    setPlacementQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: "VERIFIED",
          verifiedAt: new Date().toISOString().split("T")[0]
        };
      }
      return item;
    }));
    setToastMsg(`✓ Active employment confirmed for ${candidateName}! State outcome ledger updated.`);
    setTimeout(() => setToastMsg(""), 4500);
  };

  const handleConfirmAttrition = () => {
    if (!attritionModalItem) return;
    setPlacementQueue(prev => prev.map(item => {
      if (item.id === attritionModalItem.id) {
        return {
          ...item,
          status: "ATTRITION",
          attritionReason: attritionReason,
          attritionDate: new Date().toISOString().split("T")[0]
        };
      }
      return item;
    }));
    setToastMsg(`⚠ Attrition recorded for ${attritionModalItem.candidateName}. Remedial counseling flagged to Government.`);
    setAttritionModalItem(null);
    setTimeout(() => setToastMsg(""), 4500);
  };

  const handleFlagDiscrepancy = (id, candidateName) => {
    setPlacementQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: "DISCREPANCY"
        };
      }
      return item;
    }));
    setToastMsg(`🚨 Discrepancy logged for ${candidateName}. Escalated to MSSDS Vigilance Unit.`);
    setTimeout(() => setToastMsg(""), 4500);
  };

  const filteredQueue = placementQueue.filter(item => {
    if (filterStatus === "ALL") return true;
    return item.status === filterStatus;
  });

  return (
    <SidebarLayout sidebarItems={EMPLOYER_NAV} roleName="Employer HR Portal" roleColor="blue">
      <div className="space-y-6 animate-fadeInUp p-6">
        
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce border border-blue-500">
            <Sparkles className="w-5 h-5 text-blue-400" /> {toastMsg}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                SIH26135 · Outcome Tracking
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Employer Feedback Loop
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">Employer Verification &amp; Follow-up Gateway</h1>
            <p className="text-xs text-slate-500">Validate Placed Candidates (Day 30/90/180/360), Statutory Identifiers &amp; Digital Credentials</p>
          </div>
          <button
            onClick={() => setShowAIScanner(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow inline-flex items-center gap-2 cursor-pointer transition"
          >
            <Cpu className="w-4 h-4 text-emerald-400" /> AI Fraud &amp; Tamper Scanner
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("followup")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "followup"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <UserCheck className={`w-3.5 h-3.5 ${activeTab === "followup" ? "text-emerald-400" : "text-slate-400"}`} />
            1. Post-Placement Validation Loop (Day 30 / 90 / 180 / 360)
          </button>
          <button
            onClick={() => setActiveTab("employer")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "employer"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 ${activeTab === "employer" ? "text-emerald-400" : "text-slate-400"}`} />
            2. Statutory Employer Verification (GSTIN/EPFO/MCA)
          </button>
          <button
            onClick={() => setActiveTab("certificate")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "certificate"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${activeTab === "certificate" ? "text-blue-400" : "text-slate-400"}`} />
            3. Candidate Certificate &amp; Skill Verification
          </button>
        </div>

        {/* TAB 1: POST-PLACEMENT FOLLOW-UP & EMPLOYMENT VALIDATION (SIH26135 CRITICAL FEATURE) */}
        {activeTab === "followup" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Continuous Feedback &amp; Verification Loop
                </span>
                <h2 className="text-base font-black text-slate-900 mt-1">
                  Active Placement Confirmation Queue (Day 30, 90, 180, 360)
                </h2>
                <p className="text-xs text-slate-500">
                  Confirm active employment status for candidates placed under Maharashtra state skilling programs to ensure accurate longitudinal records.
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Status:
                </span>
                {["ALL", "PENDING_VALIDATION", "VERIFIED", "ATTRITION"].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition cursor-pointer ${
                      filterStatus === st ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st === "PENDING_VALIDATION" ? "Pending" : st === "VERIFIED" ? "Verified" : st === "ATTRITION" ? "Attrition" : "All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Placed Candidates Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                    <th className="p-3">Candidate &amp; Scheme</th>
                    <th className="p-3">Job Role &amp; Wage</th>
                    <th className="p-3">EPFO Linkage</th>
                    <th className="p-3">Follow-up Milestone</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Employer Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredQueue.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-3">
                        <p className="font-bold text-slate-900 text-xs">{item.candidateName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.candidateId}</p>
                        <span className="text-[10px] text-blue-700 font-semibold">{item.scheme}</span>
                      </td>
                      <td className="p-3">
                        <p className="font-extrabold text-slate-800">{item.jobRole}</p>
                        <p className="text-[11px] text-emerald-700 font-bold">{item.reportedSalary}</p>
                        <p className="text-[10px] text-slate-400">Joined: {item.reportedJoiningDate}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-mono text-slate-800 font-bold text-[11px]">UAN: {item.epfoUan}</p>
                        <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-emerald-200">
                          Active EPFO Match
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-indigo-50 text-indigo-800 font-bold text-[10px] px-2 py-0.5 rounded-md border border-indigo-200">
                          {item.checkpoint}
                        </span>
                      </td>
                      <td className="p-3">
                        {item.status === "VERIFIED" && (
                          <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Employer Verified
                          </span>
                        )}
                        {item.status === "PENDING_VALIDATION" && (
                          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3 text-amber-600" /> Awaiting Employer Sign-off
                          </span>
                        )}
                        {item.status === "ATTRITION" && (
                          <span className="bg-rose-100 text-rose-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
                            <XCircle className="w-3 h-3 text-rose-600" /> Attrition Reported
                          </span>
                        )}
                        {item.status === "DISCREPANCY" && (
                          <span className="bg-purple-100 text-purple-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3 text-purple-600" /> Under Audit Review
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {item.status === "PENDING_VALIDATION" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleConfirmEmployment(item.id, item.candidateName)}
                              title="Confirm trainee is actively employed"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition"
                            >
                              <ThumbsUp className="w-3 h-3" /> Confirm Active
                            </button>
                            <button
                              onClick={() => setAttritionModalItem(item)}
                              title="Report candidate has left the organization"
                              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer transition"
                            >
                              <XCircle className="w-3 h-3" /> Left Co.
                            </button>
                            <button
                              onClick={() => handleFlagDiscrepancy(item.id, item.candidateName)}
                              title="Flag wage or identity mismatch"
                              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-[10px] px-2 py-1.5 rounded-lg cursor-pointer transition"
                            >
                              ⚠ Flag
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            {item.status === "VERIFIED" ? `Signed: ${item.verifiedAt}` : "Logged in State DB"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center justify-between">
              <span>
                💡 <strong>Why Employer Sign-off Matters:</strong> It eliminates duplicate and fraudulent placement figures, ensuring state skilling subsidies are tied to authentic, long-term employment.
              </span>
              <span className="font-extrabold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200 shrink-0 ml-3">
                100% Cryptographically Logged
              </span>
            </div>
          </div>
        )}

        {/* MODAL: ATTRITION REPORTING */}
        {attritionModalItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeInUp">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    Attrition &amp; Exit Recording
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Report Exit: {attritionModalItem.candidateName}
                  </h3>
                </div>
                <button
                  onClick={() => setAttritionModalItem(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <p className="text-slate-600">
                  Please select the primary reason for departure to help the state improve curriculum and counselor support:
                </p>

                <div className="space-y-2">
                  {[
                    "Relocated to hometown / family commitments",
                    "Better wage or higher package offer elsewhere",
                    "Skill gap / unable to meet job performance baseline",
                    "Shift timing or transport / commuting barrier",
                    "Pursuing higher education or competitive exams"
                  ].map((reason, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition cursor-pointer text-xs ${
                        attritionReason === reason
                          ? "bg-rose-50 border-rose-400 text-rose-950 font-bold"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="exitReason"
                        value={reason}
                        checked={attritionReason === reason}
                        onChange={(e) => setAttritionReason(e.target.value)}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAttritionModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAttrition}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-5 py-2 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Submit Attrition Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EMPLOYER ENTERPRISE VALIDATION */}
        {activeTab === "employer" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Statutory Corporate Compliance Engine
              </span>
              <h2 className="text-base font-black text-slate-900 mt-1">
                Validate Employer Registration &amp; EPFO Contribution Signals
              </h2>
              <p className="text-xs text-slate-500">
                Cross-references GSTIN, Ministry of Corporate Affairs (MCA) CIN, and EPFO Establishment Code.
              </p>
            </div>

            <form onSubmit={handleVerifyEmployer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Establishment Name</label>
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maharashtra GSTIN (15 Digits)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MCA Corporate Identity Number (CIN - 21 Chars)</label>
                  <input
                    type="text"
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">EPFO Establishment Code</label>
                  <input
                    type="text"
                    value={epfoCode}
                    onChange={(e) => setEpfoCode(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={empLoading}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> {empLoading ? "Validating Statutory Signals..." : "Run Statutory Verification"}
                </button>
              </div>
            </form>

            {/* Employer Verification Results */}
            {empResult && (
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 animate-fadeIn shadow-xl border border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">{empResult.verificationResult?.employerName}</h3>
                    <p className="text-xs text-slate-400 font-medium">{empResult.message}</p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black px-3 py-1.5 rounded-full">
                    Trust Score: {empResult.verificationResult?.overallTrustScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">GSTIN Status</p>
                    <p className="font-mono text-emerald-400 font-bold">{empResult.verificationResult?.gstin}</p>
                    <p className="text-[11px] text-slate-300">{empResult.verificationResult?.gstinStatus}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">MCA CIN Status</p>
                    <p className="font-mono text-blue-400 font-bold">{empResult.verificationResult?.cin}</p>
                    <p className="text-[11px] text-slate-300">{empResult.verificationResult?.mcaStatus}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">EPFO Establishment</p>
                    <p className="font-mono text-purple-400 font-bold">{empResult.verificationResult?.epfoEstablishmentCode}</p>
                    <p className="text-[11px] text-slate-300">{empResult.verificationResult?.epfoStatus}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CERTIFICATE & FRAUD VERIFICATION */}
        {activeTab === "certificate" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Cryptographic Certificate Verification
              </span>
              <h2 className="text-sm font-black text-slate-900 mt-1">Query Candidate Certificate against MahaSkill Single Source DB</h2>
              <p className="text-xs text-slate-500">Authenticates valid certificates and detects unauthorized duplicate or forged credentials.</p>
            </div>

            <form onSubmit={handleVerifyCert} className="flex gap-2 text-xs">
              <input 
                type="text" 
                placeholder="Enter Certificate ID (e.g. CERT-MH-EV-8821 or CERT-SSPU-FS-9102)..." 
                value={certQuery} 
                onChange={e => setCertQuery(e.target.value)} 
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 text-xs" 
              />
              <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer text-xs">
                <Search className="w-4 h-4" /> Verify Certificate
              </button>
            </form>

            {certResult && (
              <div className={`p-5 rounded-2xl border text-xs space-y-3 animate-fadeIn ${certResult.valid ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {certResult.valid ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                    <span className="font-extrabold text-sm">{certResult.message}</span>
                  </div>
                  {certResult.valid && (
                    <button
                      onClick={() => setShowAIScanner(true)}
                      className="bg-slate-900 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Run AI Tamper Vision Scan
                    </button>
                  )}
                </div>
                {certResult.valid && certResult.certificate && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 text-[11px] font-semibold text-slate-700">
                    <p>Candidate: <strong className="text-slate-900">{certResult.certificate.candidateName}</strong></p>
                    <p>Course: <strong className="text-blue-900">{certResult.certificate.courseTitle}</strong></p>
                    <p>Provider: <strong className="text-slate-900">{certResult.certificate.providerName || certResult.certificate.provider}</strong></p>
                    <p>Score: <strong className="text-emerald-800">{certResult.certificate.score} (PASSED)</strong></p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Scanner Modal */}
        {showAIScanner && (
          <AICertificateScannerModal
            certificate={certResult?.certificate}
            candidate={{ name: certResult?.certificate?.candidateName || 'Candidate', candidateId: '101' }}
            onClose={() => setShowAIScanner(false)}
          />
        )}

      </div>
    </SidebarLayout>
  );
}
