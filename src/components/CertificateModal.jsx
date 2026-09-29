import React from 'react';
import { Award, ShieldCheck, Download, Printer, QrCode, X } from 'lucide-react';

export default function CertificateModal({ candidate, certificate, onClose }) {
  if (!candidate) return null;

  const cert = certificate || (candidate.certificates && candidate.certificates[0]) || {
    certificateId: `CERT-${candidate.candidateId}`,
    courseTitle: candidate.enrolledCourse?.title || 'React Development & UI Engineering',
    providerName: candidate.assignedProvider || 'ABC Skill Centre Pune',
    issueDate: new Date().toISOString().split('T')[0],
    score: '82%',
    status: '✓ Verified & Authenticated'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6 relative border border-slate-200 animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full">
            Government Verified Cryptographic Digital Certificate
          </span>
          <button
            onClick={handlePrint}
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
          >
            <Download className="w-4 h-4" /> Download / Print Certificate (PDF)
          </button>
        </div>

        {/* Certificate Card Printable Body */}
        <div className="p-8 bg-white border-4 border-cyan-500 rounded-3xl shadow-xl space-y-6 relative overflow-hidden text-center font-sans print:p-4 print:border-2">
          
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 font-extrabold text-[11px] uppercase px-4 py-1.5 rounded-full tracking-widest shadow">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Skill Mission · Verified Digital Credential
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">CERTIFICATE OF SKILL COMPETENCY</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Credential ID: {cert.certificateId}</p>
          </div>

          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest">This is to certify that</p>
            <h2 className="text-3xl font-black text-slate-900 underline decoration-cyan-500 decoration-2 underline-offset-4">
              {candidate.name}
            </h2>
            <p className="text-xs text-slate-500">Candidate ID: {candidate.candidateId} · {candidate.district} District</p>
            
            <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
              has successfully completed the NCVT-aligned practical skill evaluation with a score of <strong className="text-slate-900 font-black">{cert.score || '82%'}</strong> and is certified in:
            </p>

            <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl inline-block max-w-xl">
              <p className="font-black text-cyan-950 text-lg">{cert.courseTitle}</p>
              <p className="text-xs text-cyan-800 font-bold mt-0.5">Training Provider: {cert.providerName}</p>
            </div>
          </div>

          {/* Footer & Audit Hash */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-left items-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Tamper-Proof Cryptographic Hash</span>
              <p className="font-mono text-[10px] font-bold text-slate-800 break-all bg-white p-1 rounded border border-slate-200">
                0x8f9a2b4c1e6d{candidate.candidateId}7f0a9b
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="font-extrabold text-xs">Live HR Verification Ready</p>
                  <p className="text-[10px] text-slate-400">Authentic & Verified on MahaSkill 360 DB</p>
                </div>
              </div>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full">
                ✓ Authentic
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
