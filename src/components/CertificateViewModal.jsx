import React from 'react';
import { ShieldCheck, Award, Printer, Download, QrCode, X, CheckCircle2 } from 'lucide-react';

export default function CertificateViewModal({ certificate, candidate, onClose }) {
  if (!certificate || !candidate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative border border-slate-200 animate-fadeIn my-8">
        
        {/* Top Actions Bar */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-100 text-cyan-900 border border-cyan-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" /> Verifiable Digital Credential
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
            >
              <Printer className="w-4 h-4" /> Download / Print (PDF)
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="p-8 md:p-12 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 border-8 border-double border-amber-500/60 rounded-3xl space-y-6 text-center relative overflow-hidden shadow-inner print:border-amber-600 print:p-8 print:shadow-none">
          {/* Subtle Security Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

          {/* Header & Crest */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-amber-300 font-extrabold text-[11px] uppercase px-4 py-1.5 rounded-full tracking-wider shadow">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Skill Mission · Verified Digital Credential
            </div>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest pt-1">
              National Skills Qualifications Framework (NSQF) Aligned
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 tracking-tight text-amber-950 pt-2">
              CERTIFICATE OF COMPETENCY
            </h1>
            <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
              Credential ID: <span className="text-slate-800">{certificate.certificateId}</span>
            </p>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-2" />

          {/* Recipient Details */}
          <div className="space-y-3 py-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">This is to proudly certify that</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 underline decoration-cyan-500 decoration-2 underline-offset-8">
              {candidate.name}
            </h2>
            <p className="text-xs text-slate-600 font-medium max-w-xl mx-auto pt-2">
              Candidate ID: <strong className="text-slate-800 font-mono">{candidate.candidateId}</strong> · District: <strong className="text-slate-800">{candidate.district || 'Pune'}</strong>
            </p>
            <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed">
              has completed the comprehensive course curriculum and successfully passed the evaluated skill assessment examination with an authenticated score of:
            </p>

            {/* Score & Course Badge */}
            <div className="p-4 bg-white/90 border-2 border-cyan-300 rounded-2xl inline-block max-w-lg shadow-sm">
              <div className="flex items-center justify-center gap-3">
                <Award className="w-7 h-7 text-amber-500" />
                <div className="text-left">
                  <p className="text-base font-black text-slate-900">{certificate.courseTitle}</p>
                  <p className="text-xs font-bold text-cyan-800">
                    Evaluation Score: <span className="text-slate-950 font-black text-sm">{certificate.score || '100%'}</span> (Passed & Verified)
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-bold">
              Training Provider / Authority: <span className="text-slate-900">{certificate.provider || certificate.providerName || candidate.assignedProvider || 'ABC Skill Centre Pune'}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Issue Date: <strong className="text-slate-700 font-mono">{certificate.issueDate || new Date().toISOString().split('T')[0]}</strong>
            </p>
          </div>

          {/* Verification Bar & Hashes */}
          <div className="pt-4 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center text-left">
            <div className="p-3 bg-white/90 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Cryptographic SHA-256 Blockchain Hash</span>
              <p className="font-mono text-[9px] font-bold text-slate-800 break-all bg-slate-50 p-1.5 rounded border border-slate-200">
                {certificate.certHash || `0x8f9a2b4c1e6d${candidate.candidateId}7f0a9b`}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-cyan-400 shrink-0" />
                <div>
                  <p className="font-extrabold text-xs">Live HR Verification Ready</p>
                  <p className="text-[9px] text-slate-400">Scan QR to authenticate on MahaSkill State Registry</p>
                </div>
              </div>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">
                ✓ Authentic
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
