import React from 'react';
import { Building2, ShieldCheck, Printer, Download, CheckCircle2, X } from 'lucide-react';

export default function OfferLetterModal({ candidate, onClose }) {
  if (!candidate) return null;

  const emp = candidate.employmentDetails || {
    company: 'TechCorp India Ltd',
    role: 'React Frontend Engineer',
    salary: '₹3,60,000 / Year (₹30,000/mo)',
    joiningDate: new Date().toISOString().split('T')[0],
    verifiedBy: 'TechCorp Corporate HR'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative border border-slate-200 animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Official Corporate Job Offer & Joining Letter
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-4 h-4" /> Download / Print Letter (PDF)
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="space-y-6 text-slate-800 p-6 bg-slate-50 rounded-2xl border border-slate-200 print:bg-white print:p-0 font-sans">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-300 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{emp.company}</h2>
              <p className="text-xs text-slate-500">Corporate Tower, Cyber City, Pune - 411057</p>
              <p className="text-[10px] text-emerald-700 font-bold">MahaSkill 360 Verified Employer ID: EMP-MH-01</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-500">Date: {emp.joiningDate}</span>
              <p className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded mt-1 inline-block">
                Ref: OFF-{candidate.candidateId}
              </p>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <p className="font-bold text-slate-900">To,</p>
            <p className="font-extrabold text-slate-900 text-sm">{candidate.name}</p>
            <p className="text-slate-500">Candidate ID: {candidate.candidateId} · {candidate.district} District</p>
            <p className="text-slate-500">Education: {candidate.educationLevel}</p>

            <p className="pt-2 font-bold text-slate-900">
              Subject: Letter of Employment Offer for the position of <span className="text-blue-900 font-black">{emp.role}</span>
            </p>

            <p>
              Dear <strong>{candidate.name}</strong>,
            </p>
            <p>
              We are pleased to offer you employment at <strong>{emp.company}</strong> as a <strong>{emp.role}</strong>. This offer is issued based on your verified skill competency assessment and cryptographic certificate authenticated through the <strong>MahaSkill 360 Government Skilling Outcome Portal</strong>.
            </p>

            {/* Terms Table */}
            <div className="p-4 bg-white rounded-xl border border-slate-300 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Designation</span>
                  <p className="font-extrabold text-slate-900">{emp.role}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Offered Compensation</span>
                  <p className="font-extrabold text-emerald-700">{emp.salary}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Joining Date</span>
                  <p className="font-extrabold text-slate-900">{emp.joiningDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Verification Sign-off</span>
                  <p className="font-extrabold text-purple-700">{emp.verifiedBy}</p>
                </div>
              </div>
            </div>

            <p>
              Your performance, salary growth, and longitudinal retention will be monitored and audited through the Skill Mission Longitudinal Outcome Engine.
            </p>
          </div>

          {/* Footer & Signatures */}
          <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs">
            <div>
              <div className="w-32 h-10 border-b border-dashed border-slate-400 flex items-end pb-1 font-serif text-slate-500 italic text-[11px]">
                HR Manager Sign
              </div>
              <p className="font-extrabold text-slate-900 mt-1">Head of Corporate Talent Acquisition</p>
              <p className="text-[10px] text-slate-500">{emp.company}</p>
            </div>

            <div className="text-right space-y-1">
              <div className="p-2 bg-slate-900 text-white rounded-xl text-[10px] inline-flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticated on Blockchain Single Source DB
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
