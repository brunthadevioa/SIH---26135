import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/SidebarLayout';
import { GOVERNMENT_NAV } from '../../config/sidebarNav';
import { fetchGovernmentAnalytics, advanceSimulationTime } from '../../services/api';
import {
  TrendingUp, IndianRupee, Briefcase, Award, CheckCircle2,
  Calendar, Shield, RefreshCw, Zap, ArrowUpRight, Filter, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend
} from 'recharts';

export default function GovernmentLongitudinalPage() {
  const [analytics, setAnalytics] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [simulationLoading, setSimulationLoading] = useState(false);

  const loadData = async () => {
    const data = await fetchGovernmentAnalytics();
    setAnalytics(data);
    if (data?.candidates?.length > 0 && !selectedCandidate) {
      setSelectedCandidate(data.candidates[0]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdvanceSimulation = async (candidateId, milestone) => {
    setSimulationLoading(true);
    await advanceSimulationTime(candidateId, milestone);
    await loadData();
    setSimulationLoading(false);
  };

  // Retention Progression Curve Data
  const retentionCurveData = [
    { checkpoint: 'Enrollment', retentionPct: 100, avgWage: 0 },
    { checkpoint: 'Certification', retentionPct: 94, avgWage: 0 },
    { checkpoint: 'Day 30 (1M)', retentionPct: analytics?.longitudinalMetrics?.retention30DPct || 98, avgWage: 26500 },
    { checkpoint: 'Day 90 (3M)', retentionPct: analytics?.longitudinalMetrics?.retention3MPct || 95, avgWage: 29800 },
    { checkpoint: 'Day 180 (6M)', retentionPct: analytics?.longitudinalMetrics?.retention6MPct || 91, avgWage: 36200 },
    { checkpoint: 'Day 365 (12M)', retentionPct: analytics?.longitudinalMetrics?.retention12MPct || 88, avgWage: 44500 },
    { checkpoint: 'Day 730 (24M)', retentionPct: analytics?.longitudinalMetrics?.retention24MPct || 84, avgWage: 54000 }
  ];

  const filteredCandidates = (analytics?.candidates || []).filter(c => {
    if (filterType === 'ALL') return true;
    if (filterType === 'WAGE') return c.outcomeType === 'Wage Employment';
    if (filterType === 'SELF') return c.outcomeType?.includes('Self-Employment');
    if (filterType === 'NAPS') return c.outcomeType?.includes('Apprenticeship');
    if (filterType === 'REMEDIAL') return c.outcomeType?.includes('Non-Placed') || c.remediationStatus;
    return true;
  });

  return (
    <SidebarLayout sidebarItems={GOVERNMENT_NAV} roleName="Government Portal" roleColor="orange">
      {!analytics ? (
        <div className="p-12 text-center text-xs font-bold text-slate-400">Loading Longitudinal Metrics...</div>
      ) : (
        <div className="space-y-6 animate-fadeInUp">
          
          {/* Header */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                State Skilling Directorate (MSSDS)
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-1">Longitudinal Wage Progression & Retention Engine</h1>
              <p className="text-xs text-slate-500 font-medium">Tracking Post-Training Milestones from Day 30 to 24 Months</p>
            </div>
            <button
              onClick={loadData}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {/* Retention Milestones Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {[
              { label: '30-Day Checkpoint', pct: analytics.longitudinalMetrics?.retention30DPct || 98, count: analytics.longitudinalMetrics?.m30DCount || 10, color: 'text-emerald-600', sub: 'Baseline Placement' },
              { label: '90-Day (3M)', pct: analytics.longitudinalMetrics?.retention3MPct || 95, count: analytics.longitudinalMetrics?.m3MCount || 9, color: 'text-blue-600', sub: 'Probation Clearance' },
              { label: '180-Day (6M)', pct: analytics.longitudinalMetrics?.retention6MPct || 91, count: analytics.longitudinalMetrics?.m6MCount || 8, color: 'text-purple-600', sub: '1st Wage Appraisal' },
              { label: '365-Day (12M)', pct: analytics.longitudinalMetrics?.retention12MPct || 88, count: analytics.longitudinalMetrics?.m12MCount || 7, color: 'text-amber-600', sub: 'Mid-Career Retained' },
              { label: '730-Day (24M)', pct: analytics.longitudinalMetrics?.retention24MPct || 84, count: analytics.longitudinalMetrics?.m24MCount || 5, color: 'text-orange-600', sub: 'Senior Leader Role' }
            ].map(m => (
              <div key={m.label} className="bg-white p-4 rounded-3xl border border-slate-200 text-center space-y-1 shadow-xs">
                <p className="text-slate-400 font-extrabold text-[10px] uppercase">{m.label}</p>
                <p className={`text-2xl font-black ${m.color}`}>{m.pct}%</p>
                <p className="text-[10px] font-bold text-slate-700">{m.count} Trainees Retained</p>
                <p className="text-[9px] text-slate-400 font-medium">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Dual Charts: Retention Decay vs Wage Escalation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Retention Curve Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" /> Longitudinal Cohort Retention Curve (%)
                  </h2>
                  <p className="text-xs text-slate-500">Survival rate of skilling cohorts over 24 months</p>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  84% Long-Term Retention
                </span>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={retentionCurveData}>
                    <defs>
                      <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="checkpoint" tick={{ fontSize: 9, fontWeight: 700 }} />
                    <YAxis domain={[70, 100]} tick={{ fontSize: 9 }} unit="%" />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: '#0f172a', color: '#fff' }} />
                    <Area type="monotone" dataKey="retentionPct" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#retentionGrad)" name="Retention Rate (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wage Growth Trajectory Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600" /> Average Monthly Wage Escalation (₹)
                  </h2>
                  <p className="text-xs text-slate-500">Starting entry wage vs promotion appraisals</p>
                </div>
                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  +103.7% 24M Growth
                </span>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <LineChart data={retentionCurveData.filter(d => d.avgWage > 0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="checkpoint" tick={{ fontSize: 9, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 9 }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}/mo`, 'Average Wage']} contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e2e8f0', backgroundColor: '#0f172a', color: '#fff' }} />
                    <Line type="monotone" dataKey="avgWage" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} name="Avg Salary (₹)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Candidate Longitudinal Journey Deep-Dive */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Individual Candidate Longitudinal Milestones & Wage Audits
                </h2>
                <p className="text-xs text-slate-500">Select any trainee to audit employer verification, Udyam self-employment, and wage timeline</p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-[11px] font-bold">
                {[
                  { id: 'ALL', label: 'All Trainees' },
                  { id: 'WAGE', label: 'Wage Employed' },
                  { id: 'SELF', label: 'Self-Employed' },
                  { id: 'NAPS', label: 'Apprenticeship' },
                  { id: 'REMEDIAL', label: 'Remedial' }
                ].map(pill => (
                  <button
                    key={pill.id}
                    onClick={() => setFilterType(pill.id)}
                    className={`px-3 py-1 rounded-xl transition cursor-pointer ${
                      filterType === pill.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCandidates.map(cand => (
                <div
                  key={cand.candidateId}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:bg-white hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedCandidate(cand)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-slate-900 text-sm">{cand.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{cand.candidateId} · {cand.district}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      cand.outcomeType === 'Wage Employment'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : cand.outcomeType?.includes('Self-Employment')
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : cand.outcomeType?.includes('Apprenticeship')
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {cand.outcomeType || 'Seeking Placement'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Current Monthly Wage:</span>
                      <strong className="text-emerald-700">
                        ₹{Number(cand.employmentDetails?.currentSalary || cand.employmentDetails?.monthlyRevenue || cand.employmentDetails?.monthlyStipend || 0).toLocaleString('en-IN')}/mo
                      </strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Active Retention:</span>
                      <span className="font-bold text-slate-800">{cand.employmentDetails?.retentionMonths || 1} Months</span>
                    </div>
                  </div>

                  {/* Quick Simulation Buttons */}
                  <div className="flex gap-1 pt-1">
                    <button
                      disabled={simulationLoading}
                      onClick={(e) => { e.stopPropagation(); handleAdvanceSimulation(cand.candidateId, '6M'); }}
                      className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg py-1 text-[10px] font-bold cursor-pointer transition"
                    >
                      +6M Appraisal
                    </button>
                    <button
                      disabled={simulationLoading}
                      onClick={(e) => { e.stopPropagation(); handleAdvanceSimulation(cand.candidateId, '12M'); }}
                      className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg py-1 text-[10px] font-bold cursor-pointer transition"
                    >
                      +12M Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </SidebarLayout>
  );
}
