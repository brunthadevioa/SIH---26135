import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchCandidateById, fetchAllCandidates, advanceSimulationTime,
  logSelfEmployment, logApprenticeship, logWageEmployment
} from '../../services/api';
import SidebarLayout from '../../layouts/SidebarLayout';
import { CANDIDATE_NAV } from '../../config/sidebarNav';
import {
  TrendingUp, Award, Calendar, CheckCircle2, ShieldCheck,
  IndianRupee, Zap, Sparkles, Building2, Briefcase, RefreshCw,
  Clock, ArrowRight, UserCheck, Activity, Target, Bot, PhoneCall,
  PlusCircle, FileCheck, Layers
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CandidateLongitudinalPage() {
  const { currentUser } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [simulating, setSimulating] = useState(false);
  const [toast, setToast] = useState('');

  // Outcome Form State
  const [outcomeMode, setOutcomeMode] = useState('WAGE'); // WAGE, SELF, APPRENTICE
  const [companyName, setCompanyName] = useState('Tata Motors Ltd');
  const [jobRole, setJobRole] = useState('EV Battery Diagnostic Engineer');
  const [startingSalary, setStartingSalary] = useState(32000);
  const [epfoUan, setEpfoUan] = useState('101928374650');

  // Self-Emp Form State
  const [enterpriseName, setEnterpriseName] = useState('SuryaTech Solar Solutions');
  const [businessType, setBusinessType] = useState('Rooftop Solar EPC & Pump Automation');
  const [udyamRegNo, setUdyamRegNo] = useState('UDYAM-MH-15-0048291');
  const [monthlyRevenue, setMonthlyRevenue] = useState(38000);
  const [mudraAmount, setMudraAmount] = useState(200000);

  // Apprenticeship Form State
  const [napsCompany, setNapsCompany] = useState('Bajaj Auto Ltd (Waluj Plant)');
  const [napsContractId, setNapsContractId] = useState('NAPS-MH-2025-994821');
  const [monthlyStipend, setMonthlyStipend] = useState(15000);

  async function loadData() {
    try {
      const list = await fetchAllCandidates();
      let targetId = currentUser?.candidateId || currentUser?.id || currentUser?.email || (list && list[0] ? list[0].candidateId : null);
      let data = null;
      if (targetId) {
        data = await fetchCandidateById(targetId);
      }
      if (!data && list && list.length > 0) {
        data = list.find(c => c.candidateId === currentUser?.id || c.email === currentUser?.email) || list[0];
      }
      setCandidate(data || list[0]);
    } catch (err) {
      console.error('Error loading longitudinal data:', err);
    }
  }

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSimulate = async (milestone) => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId) return;
    setSimulating(true);
    try {
      await advanceSimulationTime(candId, milestone || '6M');
      await loadData();
      setToast(`⚡ Advanced longitudinal outcome to ${milestone}! Wage updated & verified.`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleSaveOutcome = async (e) => {
    e.preventDefault();
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId) return;

    if (outcomeMode === 'WAGE') {
      await logWageEmployment({
        candidateId: candId,
        company: companyName,
        role: jobRole,
        startingSalary,
        epfoUan
      });
      setToast('✓ Wage Employment verified via EPFO linkage!');
    } else if (outcomeMode === 'SELF') {
      await logSelfEmployment({
        candidateId: candId,
        enterpriseName,
        businessType,
        udyamRegistrationNumber: udyamRegNo,
        monthlyRevenue,
        mudraLoanSanctioned: true,
        mudraLoanAmount: mudraAmount,
        employeesHired: 2
      });
      setToast('✓ Self-Employment & Udyam Registration verified!');
    } else if (outcomeMode === 'APPRENTICE') {
      await logApprenticeship({
        candidateId: candId,
        company: napsCompany,
        role: 'Graduate Apprenticeship Trainee (NAPS)',
        napsContractId,
        monthlyStipend,
        apprenticeshipDurationMonths: 12
      });
      setToast('✓ NAPS Apprenticeship Contract linked with DBT Stipend!');
    }

    setTimeout(() => setToast(''), 4000);
    await loadData();
  };

  const progressionData = candidate?.salaryProgression || [
    { period: 'Jan 2026', salary: 0 },
    { period: 'Day 30', salary: 28000 },
    { period: 'Day 90', salary: 32000 },
    { period: 'Day 180', salary: 38000 }
  ];

  const emp = candidate?.employmentDetails;

  return (
    <SidebarLayout sidebarItems={CANDIDATE_NAV} roleName="Candidate Portal" roleColor="emerald">
      <div className="space-y-6 animate-fadeInUp p-6">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-amber-300" /> {toast}
          </div>
        )}

        {/* Header */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Longitudinal Career Pathway
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">Post-Skilling Outcome & Wage Progression</h1>
            <p className="text-xs text-slate-500 font-medium">Tracking career checkpoints from Day 30 to 24 Months</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSimulate('6M')}
              disabled={simulating}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" /> +6M Appraisal
            </button>
            <button
              onClick={() => handleSimulate('12M')}
              disabled={simulating}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" /> +12M Review
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'timeline', label: 'Career Timeline & Wage Graph', icon: TrendingUp },
            { id: 'logoutcome', label: 'Log Outcome (Self-Emp / NAPS / Wage)', icon: PlusCircle },
            { id: 'followups', label: 'Survey & Follow-Up History', icon: Bot }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: TIMELINE & WAGE GRAPH */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            
            {/* Top Active Outcome Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                    Active Outcome Verification
                  </span>
                  <h2 className="text-base font-black mt-0.5">
                    {candidate?.outcomeType || 'Wage Employment'} · {emp?.company || emp?.enterpriseName || 'Tata Motors Ltd'}
                  </h2>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-3 py-1 rounded-full">
                  ✓ {candidate?.employmentStatus || 'EMPLOYED VERIFIED'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Current Monthly Earning</p>
                  <p className="text-xl font-black text-emerald-400">
                    ₹{Number(emp?.currentSalary || emp?.monthlyRevenue || emp?.monthlyStipend || 32000).toLocaleString('en-IN')}/mo
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Retention Duration</p>
                  <p className="text-xl font-black text-blue-400">{emp?.retentionMonths || 8} Months</p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Verification Source</p>
                  <p className="text-xs font-bold text-purple-300 truncate">{emp?.verifiedBy || 'EPFO / Udyam Direct API'}</p>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Identifier / Code</p>
                  <p className="text-xs font-mono text-amber-300 truncate">{emp?.epfoUan || emp?.udyamRegistrationNumber || emp?.napsContractId || 'MH-102931'}</p>
                </div>
              </div>
            </div>

            {/* Wage Progression Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600" /> My Wage Escalation Trajectory (₹)
                  </h2>
                  <p className="text-xs text-slate-500">Live progression tracked over longitudinal checkpoints</p>
                </div>
              </div>

              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <AreaChart data={progressionData}>
                    <defs>
                      <linearGradient id="wageGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="period" tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}/mo`, 'Salary']} contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: '#0f172a', color: '#fff' }} />
                    <Area type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#wageGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Milestone Chronology */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Calendar className="w-4 h-4 text-orange-600" /> Longitudinal Audit Trail & Milestones
              </h2>

              <div className="space-y-3">
                {(candidate?.milestones || []).map((m, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-extrabold text-slate-900">{m.milestone}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LOG OUTCOME CONSOLE */}
        {activeTab === 'logoutcome' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900">Declare / Update Employment & Skilling Outcome</h2>
              <p className="text-xs text-slate-500">Record wage employment, self-employment micro-enterprise, or NAPS apprenticeship</p>
            </div>

            {/* Outcome Type Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'WAGE', label: '1. Wage Employment', sub: 'Corporate / Industrial Job' },
                { id: 'SELF', label: '2. Self-Employment', sub: 'Udyam / Micro-Enterprise' },
                { id: 'APPRENTICE', label: '3. Apprenticeship', sub: 'NAPS / NATS Contract' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setOutcomeMode(opt.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                    outcomeMode === opt.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-extrabold text-xs">{opt.label}</p>
                  <p className={`text-[10px] mt-0.5 ${outcomeMode === opt.id ? 'text-slate-300' : 'text-slate-500'}`}>{opt.sub}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveOutcome} className="space-y-4 text-xs">
              {outcomeMode === 'WAGE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / Employer Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Monthly Starting Wage (₹)</label>
                    <input
                      type="number"
                      value={startingSalary}
                      onChange={(e) => setStartingSalary(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">EPFO UAN Number (12 Digits)</label>
                    <input
                      type="text"
                      value={epfoUan}
                      onChange={(e) => setEpfoUan(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {outcomeMode === 'SELF' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Enterprise / Business Name</label>
                    <input
                      type="text"
                      value={enterpriseName}
                      onChange={(e) => setEnterpriseName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Business Domain / Sector</label>
                    <input
                      type="text"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Udyam Registration Number</label>
                    <input
                      type="text"
                      value={udyamRegNo}
                      onChange={(e) => setUdyamRegNo(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Average Monthly Revenue (₹)</label>
                    <input
                      type="number"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {outcomeMode === 'APPRENTICE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Establishment / Industry Partner</label>
                    <input
                      type="text"
                      value={napsCompany}
                      onChange={(e) => setNapsCompany(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">NAPS Contract ID</label>
                    <input
                      type="text"
                      value={napsContractId}
                      onChange={(e) => setNapsContractId(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Monthly Stipend (₹)</label>
                    <input
                      type="number"
                      value={monthlyStipend}
                      onChange={(e) => setMonthlyStipend(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" /> Save Outcome to Government Database
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: FOLLOW-UP SURVEY HISTORY */}
        {activeTab === 'followups' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" /> Automated & Assisted Survey Logs
                </h2>
                <p className="text-xs text-slate-500">Responses captured via WhatsApp bot and MSSDS Call-Center</p>
              </div>
            </div>

            <div className="space-y-3">
              {(candidate?.followupHistory || []).map((flw, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      {flw.channel.includes('WhatsApp') ? <Bot className="w-3.5 h-3.5 text-blue-600" /> : <PhoneCall className="w-3.5 h-3.5 text-orange-600" />}
                      {flw.channel} · {flw.checkpoint}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{flw.date}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{flw.notes}</p>
                  <div className="flex gap-4 text-[11px] pt-1">
                    <span className="text-slate-500">Status: <strong className="text-emerald-700">{flw.status}</strong></span>
                    <span className="text-slate-500">Satisfaction: <strong className="text-amber-600">★ {flw.satisfactionScore || 5}/5</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
