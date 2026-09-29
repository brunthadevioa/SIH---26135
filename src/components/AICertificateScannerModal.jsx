import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Cpu, Sparkles, CheckCircle2, AlertTriangle, 
  X, FileSearch, ArrowRight, RefreshCw, QrCode, Lock, Fingerprint 
} from 'lucide-react';

export default function AICertificateScannerModal({ certificate, candidate, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanMode, setScanMode] = useState('authentic'); // 'authentic' or 'simulated_tamper'

  const certData = certificate || {
    certificateId: `CERT-${candidate?.candidateId || 'MH2601'}`,
    courseTitle: candidate?.enrolledCourse?.title || 'React & Full Stack Engineering',
    provider: candidate?.assignedProvider || 'ABC Skill Centre Pune',
    score: '82%',
    issueDate: new Date().toISOString().split('T')[0],
    certHash: `0x8f9a2b4c1e6d${candidate?.candidateId || '101'}7f0a9b`
  };

  const runAIScan = (mode = scanMode) => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      if (mode === 'authentic') {
        setScanResult({
          isAuthentic: true,
          verdict: 'ORIGINAL & AUTHENTIC',
          confidenceScore: 99.8,
          hashValid: true,
          issuerAccredited: true,
          tamperScore: 0.2, // 0.2% tamper likelihood
          visualIntegrity: '100% (No Font/Pixel Alterations Detected)',
          blockchainMatch: 'Matched with Block #892,104 on MahaSkill Ledger',
          checks: [
            { name: 'SHA-256 Cryptographic Hash Check', status: 'PASS', detail: 'Hash matches mathematical signature on registry' },
            { name: 'AI Computer Vision Layout & Font Audit', status: 'PASS', detail: 'No pixel shifts, font spoofing, or layer artifacts' },
            { name: 'Issuing Authority NSQF Registry', status: 'PASS', detail: 'Verified active Skill Mission partner' },
            { name: 'QR Code Signature Matching', status: 'PASS', detail: 'Live verification endpoint matches issuer public key' },
          ]
        });
      } else {
        setScanResult({
          isAuthentic: false,
          verdict: 'FRAUDULENT / TAMPERED CREDENTIAL DETECTED',
          confidenceScore: 18.4,
          hashValid: false,
          issuerAccredited: false,
          tamperScore: 89.6, // 89.6% tamper likelihood
          visualIntegrity: 'FAILED (Font mismatch in recipient name & altered score text)',
          blockchainMatch: 'No record found on State Blockchain Single Source DB',
          checks: [
            { name: 'SHA-256 Cryptographic Hash Check', status: 'FAIL', detail: 'Signature mismatch: hash does not match candidate registry' },
            { name: 'AI Computer Vision Layout & Font Audit', status: 'FAIL', detail: 'Discrepancy in text baseline and modified pixel density' },
            { name: 'Issuing Authority NSQF Registry', status: 'FAIL', detail: 'Unaccredited or spoofed issuer authority identifier' },
            { name: 'QR Code Signature Matching', status: 'FAIL', detail: 'QR payload points to unverified external origin' },
          ]
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative border border-slate-200 animate-fadeIn my-6">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 flex items-center gap-1 w-fit">
              <Cpu className="w-3.5 h-3.5 text-cyan-700" /> AI/ML Neural Vision & Blockchain Fraud Scanner
            </span>
            <h2 className="text-xl font-black text-slate-900">Certificate Authenticity Analyzer</h2>
            <p className="text-xs text-slate-500">
              Deep-learning inspection for tamper detection, forged seals, hash mismatches, and issuer validity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Certificate Preview Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{certData.courseTitle}</p>
              <p className="text-[11px] text-slate-500">
                Candidate: <strong className="text-slate-800">{candidate?.name || 'Candidate'}</strong> · Credential ID: <span className="font-mono text-cyan-800 font-bold">{certData.certificateId}</span>
              </p>
            </div>
            <span className="font-mono text-[10px] bg-white border border-slate-300 px-2 py-1 rounded-md text-slate-600">
              Issuer: {certData.provider || 'ABC Skill Centre Pune'}
            </span>
          </div>
        </div>

        {/* Scan Mode Toggle for Testing */}
        <div className="flex items-center justify-between p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="font-bold text-cyan-950">AI Verification Mode:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setScanMode('authentic'); runAIScan('authentic'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                scanMode === 'authentic'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Verify Authentic Certificate
            </button>
            <button
              onClick={() => { setScanMode('simulated_tamper'); runAIScan('simulated_tamper'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                scanMode === 'simulated_tamper'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Simulate Fake/Tampered Document
            </button>
          </div>
        </div>

        {/* Run Scan Action Button */}
        {!scanResult && !scanning && (
          <div className="text-center py-6 space-y-3">
            <Fingerprint className="w-14 h-14 text-cyan-600 mx-auto animate-pulse" />
            <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
              Click below to initiate the neural AI/ML optical inspection and compare the cryptographic signature with the state database.
            </p>
            <button
              onClick={() => runAIScan()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg inline-flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
            >
              <FileSearch className="w-4 h-4" /> Run AI Fraud & Authenticity Scan
            </button>
          </div>
        )}

        {/* Scanning Progress */}
        {scanning && (
          <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200 animate-pulse">
            <RefreshCw className="w-10 h-10 text-cyan-600 animate-spin mx-auto" />
            <p className="text-sm font-extrabold text-slate-800">Neural Network Analyzing Credential...</p>
            <p className="text-xs text-slate-500">Checking SHA-256 hash, OCR font alignment, seal watermark & issuer key registry...</p>
          </div>
        )}

        {/* Scan Results */}
        {scanResult && !scanning && (
          <div className={`p-6 rounded-3xl border-2 space-y-5 shadow-md ${
            scanResult.isAuthentic ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950' : 'bg-rose-50/70 border-rose-400 text-rose-950'
          }`}>
            {/* Result Header */}
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {scanResult.isAuthentic ? (
                  <ShieldCheck className="w-9 h-9 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-9 h-9 text-rose-600 shrink-0" />
                )}
                <div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    scanResult.isAuthentic ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                  }`}>
                    {scanResult.isAuthentic ? '✓ VERIFIED GENUINE' : '⚠️ FRAUD ALERT / REJECTED'}
                  </span>
                  <h3 className="text-lg font-black mt-0.5">{scanResult.verdict}</h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">AI Authenticity Confidence</span>
                <p className={`text-2xl font-black ${scanResult.isAuthentic ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {scanResult.confidenceScore}%
                </p>
              </div>
            </div>

            {/* Checks Table */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <p className="text-xs font-black uppercase tracking-wider text-slate-700">Detailed AI Diagnostic Breakdown:</p>
              <div className="space-y-1.5">
                {scanResult.checks.map((c, idx) => (
                  <div key={idx} className="p-2.5 bg-white/80 rounded-xl border border-slate-200 flex justify-between items-center text-xs gap-3">
                    <div className="flex items-center gap-2">
                      {c.status === 'PASS' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <p className="font-extrabold text-slate-900">{c.name}</p>
                        <p className="text-[11px] text-slate-500">{c.detail}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      c.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Re-scan Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => runAIScan()}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-scan Credential
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
