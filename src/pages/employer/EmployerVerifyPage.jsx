import React, { useState } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { EMPLOYER_NAV } from "../../config/sidebarNav";
import { verifyCertificateHR, verifyEmployerCredentials } from "../../services/api";
import AICertificateScannerModal from "../../components/AICertificateScannerModal";
import {
  Search, CheckCircle2, AlertCircle, Cpu, ShieldCheck,
  Building2, CheckCircle, Award, Layers, Shield
} from "lucide-react";

export default function EmployerVerifyPage() {
  const [activeTab, setActiveTab] = useState("employer"); // "employer" or "certificate"
  
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

  return (
    <SidebarLayout sidebarItems={EMPLOYER_NAV} roleName="Employer HR Portal" roleColor="blue">
      <div className="space-y-6 animate-fadeInUp p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Enterprise Verification Center
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">Employer & Trainee Verification Gateway</h1>
            <p className="text-xs text-slate-500">Validate Employer Legal Identifiers (GSTIN, EPFO, MCA) &amp; Digital Certificates</p>
          </div>
          <button
            onClick={() => setShowAIScanner(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow inline-flex items-center gap-2 cursor-pointer transition"
          >
            <Cpu className="w-4 h-4 text-emerald-400" /> AI Fraud &amp; Tamper Scanner
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("employer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "employer"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" /> 1. Employer Enterprise Verification (GSTIN/EPFO/MCA)
          </button>
          <button
            onClick={() => setActiveTab("certificate")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "certificate"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-400" /> 2. Candidate Certificate &amp; Skill Verification
          </button>
        </div>

        {/* TAB 1: EMPLOYER ENTERPRISE VALIDATION */}
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

        {/* TAB 2: CERTIFICATE & FRAUD VERIFICATION */}
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
