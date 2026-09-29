import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/SidebarLayout';
import { GOVERNMENT_NAV } from '../../config/sidebarNav';
import { fetchGovernmentAnalytics, fetchSkillGapsAndAttrition, triggerRemedialAction } from '../../services/api';
import {
  PieChart, BarChart3, TrendingUp, Users, Award, Shield, CheckCircle2,
  AlertTriangle, MapPin, Building2, BookOpen, Layers, RefreshCw, Sparkles,
  ArrowUpRight, HeartHandshake, CheckCircle, ChevronRight, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function GovernmentAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('cohorts');
  const [analytics, setAnalytics] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remedialModalCandidate, setRemedialModalCandidate] = useState(null);
  const [remedialCourse, setRemedialCourse] = useState('Advanced Fast-Track Industrial Bridge Module');
  const [counselorNotes, setCounselorNotes] = useState('Assigned local MIDC cluster placement and stipend support.');
  const [remediationSuccessMsg, setRemediationSuccessMsg] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    const data = await fetchGovernmentAnalytics();
    setAnalytics(data);
    const sgData = await fetchSkillGapsAndAttrition();
    setSkillGapData(sgData);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleTriggerRemediation = async (e) => {
    e.preventDefault();
    if (!remedialModalCandidate) return;
    const res = await triggerRemedialAction({
      candidateId: remedialModalCandidate.candidateId,
      remedialCourseTitle: remedialCourse,
      counselorNotes: counselorNotes,
      targetCluster: remedialModalCandidate.district
    });
    setRemediationSuccessMsg(`✓ Successfully triggered remedial bridge action for ${remedialModalCandidate.name}!`);
    setTimeout(() => {
      setRemedialModalCandidate(null);
      setRemediationSuccessMsg('');
      loadAllData();
    }, 1800);
  };

  return (
    <SidebarLayout sidebarItems={GOVERNMENT_NAV} roleName="Government Portal" roleColor="orange">
      <div className="space-y-6 animate-fadeInUp">
        
        {/* Header */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
              State Skilling Directorate (MSSDS)
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">Multi-Dimensional Policy & Cohort Analytics</h1>
            <p className="text-xs text-slate-500 font-medium">Evidence-Based Skilling Insights · Real-Time Relational Data</p>
          </div>
          <button
            onClick={loadAllData}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'cohorts', label: '1. Cohort & Courses', icon: BookOpen },
            { id: 'providers', label: '2. Provider Accountability', icon: Building2 },
            { id: 'districts', label: '3. District Geographic Heatmap', icon: MapPin },
            { id: 'demographics', label: '4. Demographics & Inclusivity', icon: Users },
            { id: 'skillgaps', label: '5. Skill Gaps & Attrition Causes', icon: AlertTriangle }
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
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-orange-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">Loading Deep Analytics Engine...</div>
        ) : (
          <div>
            {/* TAB 1: COHORT & COURSE ANALYTICS */}
            {activeTab === 'cohorts' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Total Courses Monitored</p>
                    <p className="text-2xl font-black text-slate-900">{analytics?.courses?.length || 8} Active Tracks</p>
                    <p className="text-xs text-emerald-600 font-bold">100% Industry Aligned (NSQF Levels 4-6)</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Average Placement & Progression Rate</p>
                    <p className="text-2xl font-black text-blue-600">{analytics?.placementRate || 91.5}%</p>
                    <p className="text-xs text-slate-500 font-medium">Includes Wage, Self-Emp & Apprenticeship</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Statewide Average Monthly Wage</p>
                    <p className="text-2xl font-black text-emerald-700">{analytics?.avgSalary || '₹32,500/mo'}</p>
                    <p className="text-xs text-emerald-600 font-bold">+34.8% Progression at 12M Retentions</p>
                  </div>
                </div>

                {/* Course Matrix Table */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-orange-600" /> NSQF Course Performance & Outcome Return (ROI)
                    </h2>
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Live Verification Data
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                          <th className="p-3">Course / Trade Title</th>
                          <th className="p-3">Sector</th>
                          <th className="p-3">NSQF Level</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3">Placement Rate</th>
                          <th className="p-3">Avg Monthly Wage</th>
                          <th className="p-3">Demand Index</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {(analytics?.courses || []).map(course => (
                          <tr key={course.id} className="hover:bg-slate-50/80 transition">
                            <td className="p-3 font-bold text-slate-900">{course.title}</td>
                            <td className="p-3"><span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md text-[11px]">{course.sector}</span></td>
                            <td className="p-3 font-bold text-purple-700">{course.nsqfLevel || 'Level 5'}</td>
                            <td className="p-3 text-slate-500">{course.duration}</td>
                            <td className="p-3 font-black text-emerald-700">{course.placementRate || '92.0%'}</td>
                            <td className="p-3 font-bold text-slate-900">{course.avgStartingSalary || '₹28,000/mo'}</td>
                            <td className="p-3"><span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md text-[10px]">{course.demandIndex || 'High'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROVIDER ACCOUNTABILITY */}
            {activeTab === 'providers' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-3xl text-white space-y-2 shadow-lg">
                  <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest">
                    Performance-Linked Provider Governance
                  </span>
                  <h2 className="text-base font-black">Training Provider Accountability Scorecard & SLA Compliance</h2>
                  <p className="text-xs text-slate-300">
                    Providers are ranked transparently on audited placement ratios, retention rate at 90 days, and remedial action turnaround.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(analytics?.providers || []).map((prov, i) => (
                    <div key={prov.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-400 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Reg: {prov.registrationNo || prov.id}</span>
                          <h3 className="text-sm font-black text-slate-900 mt-0.5">{prov.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-orange-500" /> {prov.district} District
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-black">
                            ★ {prov.starRating || 4.8} / 5.0
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">Total Trained</p>
                          <p className="text-base font-black text-slate-900">{prov.totalCertified || 450}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">Verified Placed</p>
                          <p className="text-base font-black text-emerald-700">{prov.placedCount || 410}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">Placement %</p>
                          <p className="text-sm font-extrabold text-blue-700">{prov.placementRate || 91.0}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">SLA Compliance</p>
                          <p className="text-sm font-extrabold text-emerald-700">{prov.slaCompliancePct || 98.0}%</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> High Performance Tier
                        </span>
                        <span className="font-mono text-[10px]">{prov.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: DISTRICT & GEOGRAPHIC HEATMAP */}
            {activeTab === 'districts' && (
              <div className="space-y-6">
                {/* District Comparison Chart & Overview */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-600" /> District-Level Skilling Outcomes &amp; Employment Density
                      </h2>
                      <p className="text-xs text-slate-500">Evidence-based outcome tracking across all 36 Maharashtra skilling districts</p>
                    </div>
                    <span className="text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 px-3 py-1 rounded-full">
                      {(analytics?.districtBreakdown || []).length} Key Districts Tracked
                    </span>
                  </div>

                  {/* Comparative Outcome Chart */}
                  <div className="h-64 pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics?.districtBreakdown || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="district" tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px', fontSize: '11px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Bar dataKey="wage" name="Wage Employed" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="self" name="Self-Employed (GST/Udyam)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="apprentice" name="Apprenticeship (NAPS)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="remedial" name="Remedial / Gap" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* District Cards Grid */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" /> District Outcome Breakdown &amp; Remedial Bridge Triggers
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Click any district to inspect root causes</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(analytics?.districtBreakdown || []).map(dist => (
                      <div
                        key={dist.district}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:bg-white hover:border-orange-300 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" /> {dist.district}
                          </h4>
                          <span className="text-[10px] font-extrabold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md">
                            {dist.total} Trainees
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl">
                            <p className="text-[9px] text-emerald-800 font-bold uppercase">Wage</p>
                            <p className="text-sm font-black text-emerald-700">{dist.wage}</p>
                          </div>
                          <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl">
                            <p className="text-[9px] text-blue-800 font-bold uppercase">Self-Emp</p>
                            <p className="text-sm font-black text-blue-700">{dist.self}</p>
                          </div>
                          <div className="bg-purple-50 border border-purple-100 p-2 rounded-xl">
                            <p className="text-[9px] text-purple-800 font-bold uppercase">NAPS</p>
                            <p className="text-sm font-black text-purple-700">{dist.apprentice}</p>
                          </div>
                        </div>

                        {/* District Industry Focus & Policy Indicator */}
                        <div className="text-[10px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200 space-y-1">
                          <p className="font-bold text-slate-800">
                            Key Sectors: <span className="font-medium">{dist.district === 'Pune' ? 'Automotive, EV & IT' : dist.district === 'Mumbai' ? 'FinTech, IT & Services' : dist.district === 'Nashik' ? 'Agro-Tech & Precision Mfg' : dist.district === 'Nagpur' ? 'Logistics, Aerospace & Power' : 'Engineering & Textiles'}</span>
                          </p>
                          <p className="text-emerald-700 font-bold">
                            Avg Wage Growth: +26% at M12
                          </p>
                        </div>

                        {dist.remedial > 0 && (
                          <div className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 p-2 rounded-xl flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              {dist.remedial} Remedial Required
                            </span>
                            <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded text-[9px] font-black">
                              Action Live
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence-Based Policy Action Banner for Districts */}
                <div className="p-6 bg-gradient-to-r from-orange-900 to-slate-900 text-white rounded-3xl border border-orange-800/60 shadow-lg space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full">
                      Evidence-Based District Policy Trigger
                    </span>
                    <span className="text-xs font-bold text-slate-300">DPDP Consent-Backed Outcome Engine</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Automated Remedial Allocation &amp; District Job Drives
                  </h3>
                  <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    By linking longitudinal wage signals and EPFO/GST verified outcomes, the system identifies under-performing clusters across Tier-2 and Tier-3 Maharashtra districts, automatically proposing targeted remedial modules, apprenticeship incentives, and local employer matching.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: DEMOGRAPHICS & INCLUSIVITY */}
            {activeTab === 'demographics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Female Participation</p>
                    <p className="text-2xl font-black text-pink-600">{analytics?.demographics?.femalePct || 45}%</p>
                    <p className="text-xs text-slate-500 font-medium">{analytics?.demographics?.femaleCount || 5} Female Trainees</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Male Participation</p>
                    <p className="text-2xl font-black text-blue-600">{analytics?.demographics?.malePct || 55}%</p>
                    <p className="text-xs text-slate-500 font-medium">{analytics?.demographics?.maleCount || 6} Male Trainees</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">PwD Inclusion</p>
                    <p className="text-2xl font-black text-purple-600">{analytics?.demographics?.pwdCount || 1} Candidate</p>
                    <p className="text-xs text-purple-600 font-bold">Special Accessibility Enabled</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Rural / Semi-Urban Reach</p>
                    <p className="text-2xl font-black text-emerald-700">65%</p>
                    <p className="text-xs text-slate-500 font-medium">Deep Tier-2/3 District Inclusivity</p>
                  </div>
                </div>

                {/* Social Category Representation */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" /> Social Category Representation & Equal Opportunity Tracking
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(analytics?.demographics?.socialCategories || []).map((cat, i) => (
                      <div key={cat.name} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase">{cat.name}</p>
                        <p className="text-xl font-black text-slate-900">{cat.value}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Candidates</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SKILL GAPS & ATTRITION ROOT CAUSES */}
            {activeTab === 'skillgaps' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skill Gap Matrix */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" /> Live Industry Skill Gap Frequency
                      </h2>
                      <p className="text-xs text-slate-500">Skills flagged by employers as missing in applicant baseline</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { skill: 'Advanced SCADA Networking', freq: 4, severity: 'High Gap' },
                        { skill: 'Siemens TIA Portal', freq: 3, severity: 'Moderate Gap' },
                        { skill: 'Cloud QuickBooks & Remote Tools', freq: 3, severity: 'Moderate Gap' },
                        { skill: 'CAN Bus Diagnostics', freq: 2, severity: 'Resolved via CoE' },
                        { skill: 'Robotic Arm Teaching', freq: 2, severity: 'Resolved via CoE' }
                      ].map(sg => (
                        <div key={sg.skill} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{sg.skill}</p>
                            <span className="text-[10px] text-purple-700 font-semibold">{sg.severity}</span>
                          </div>
                          <span className="bg-purple-100 text-purple-800 font-black px-2.5 py-1 rounded-md text-xs">
                            {sg.freq} Candidates Flagged
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attrition & Non-Placement Root Cause Matrix */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" /> Reasons for Non-Placement / Attrition
                      </h2>
                      <p className="text-xs text-slate-500">Longitudinal post-training exit interviews & root cause analysis</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { reason: 'Low Starting Wage Offer in Metro (<₹14k) vs Living Cost', count: 2, action: 'Local MIDC Fast-Track Placement' },
                        { reason: 'Caregiving & Family Responsibility at Hometown', count: 1, action: 'Remote / Freelance Hub Track' },
                        { reason: 'Delayed Stipend / Transport Barrier', count: 1, action: 'Direct DBT Subsidy Linked' }
                      ].map(cause => (
                        <div key={cause.reason} className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <p className="font-extrabold text-rose-950">{cause.reason}</p>
                            <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shrink-0">
                              {cause.count} Trainees
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-rose-100 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-700">Remedial Action: {cause.action}</span>
                            <span className="text-emerald-700 font-extrabold">Active 🎯</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Candidate Remedial Actions Trigger Table */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Targeted Remedial Actions & Interventions Console
                      </h2>
                      <p className="text-xs text-slate-500">Trigger targeted bridge modules for non-placed trainees</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                          <th className="p-3">Candidate</th>
                          <th className="p-3">District</th>
                          <th className="p-3">Identified Root Cause</th>
                          <th className="p-3">Remediation Status</th>
                          <th className="p-3">Assigned Bridge Track</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {(analytics?.candidates || []).filter(c => c.attritionRootCause || c.nonPlacementReason || c.remediationStatus).map(cand => (
                          <tr key={cand.candidateId} className="hover:bg-slate-50 transition">
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{cand.name}</p>
                              <p className="text-[10px] font-mono text-slate-400">{cand.candidateId}</p>
                            </td>
                            <td className="p-3">{cand.district}</td>
                            <td className="p-3 text-rose-800 font-semibold">{cand.attritionRootCause || cand.nonPlacementReason}</td>
                            <td className="p-3">
                              <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                                {cand.remediationStatus || 'Pending Remediation'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-800 font-medium">
                              {cand.remedialActionDetails?.assignedBridgeCourse || 'Local MIDC Bridge Fast-Track'}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setRemedialModalCandidate(cand)}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                              >
                                Trigger Remediation
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Remedial Action Trigger Modal */}
        {remedialModalCandidate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    Targeted Remedial Intervention
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">Assign Bridge Course for {remedialModalCandidate.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Candidate ID: {remedialModalCandidate.candidateId} · {remedialModalCandidate.district}</p>
                </div>
                <button
                  onClick={() => setRemedialModalCandidate(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-black p-1"
                >
                  ✕
                </button>
              </div>

              {remediationSuccessMsg ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold text-center">
                  {remediationSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleTriggerRemediation} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Identified Barrier / Attrition Reason</label>
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl font-medium text-rose-900">
                      {remedialModalCandidate.attritionRootCause || remedialModalCandidate.nonPlacementReason || 'Skill Mismatch'}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Recommended Bridge / Remedial Module</label>
                    <select
                      value={remedialCourse}
                      onChange={(e) => setRemedialCourse(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                    >
                      <option value="Advanced SCADA & Local Nashik Industrial Placement Fast-Track">Advanced SCADA & Local Nashik Industrial Placement Fast-Track</option>
                      <option value="Freelance Cloud Bookkeeping & Remote Accounting Work-From-Home Track">Freelance Cloud Bookkeeping & Remote Accounting Work-From-Home Track</option>
                      <option value="Solar EPC Micro-Enterprise & MUDRA Incubation Track">Solar EPC Micro-Enterprise & MUDRA Incubation Track</option>
                      <option value="NAPS Fast-Track Apprenticeship Matching with Stipend Support">NAPS Fast-Track Apprenticeship Matching with Stipend Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Counselor & Remedial Officer Notes</label>
                    <textarea
                      rows={3}
                      value={counselorNotes}
                      onChange={(e) => setCounselorNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                      placeholder="Enter counseling and targeted remedial actions..."
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRemedialModalCandidate(null)}
                      className="px-4 py-2 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" /> Confirm & Trigger Action
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
