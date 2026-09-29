import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/SidebarLayout';
import { GOVERNMENT_NAV } from '../../config/sidebarNav';
import { fetchFollowups, triggerAutomatedFollowup, logAssistedCall, fetchAllCandidates } from '../../services/api';
import {
  PhoneCall, MessageSquare, Bot, CheckCircle2, UserCheck, Calendar,
  TrendingUp, RefreshCw, Send, PlusCircle, Star, AlertCircle, Search, Filter
} from 'lucide-react';

export default function GovernmentFollowupsPage() {
  const [followupData, setFollowupData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [filterCheckpoint, setFilterCheckpoint] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Assisted Call Modal State
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [checkpoint, setCheckpoint] = useState('Day 90');
  const [officerName, setOfficerName] = useState('Pooja Salunkhe (MSSDS Officer)');
  const [employmentStatus, setEmploymentStatus] = useState('EMPLOYED VERIFIED');
  const [salaryReported, setSalaryReported] = useState(32000);
  const [satisfactionScore, setSatisfactionScore] = useState(5);
  const [attritionReason, setAttritionReason] = useState('');
  const [callNotes, setCallNotes] = useState('Candidate confirmed steady role and verified active EPFO link.');
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    const data = await fetchFollowups();
    setFollowupData(data);
    const candList = await fetchAllCandidates();
    setCandidates(candList);
    if (candList.length > 0 && !selectedCandidateId) {
      setSelectedCandidateId(candList[0].candidateId);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerAutomated = async (candidateId, cp, channel) => {
    await triggerAutomatedFollowup({
      candidateId,
      checkpoint: cp || 'Day 90',
      channel: channel || 'WhatsApp Automated Bot'
    });
    setSuccessMessage(`✓ Sent automated ${channel || 'WhatsApp'} survey to candidate!`);
    setTimeout(() => {
      setSuccessMessage('');
      loadData();
    }, 1500);
  };

  const handleSaveAssistedCall = async (e) => {
    e.preventDefault();
    await logAssistedCall({
      candidateId: selectedCandidateId,
      checkpoint,
      officerName,
      employmentStatus,
      salaryReported,
      satisfactionScore,
      attritionReason: attritionReason || null,
      notes: callNotes
    });
    setSuccessMessage('✓ Assisted call interview logged and saved to single source database!');
    setTimeout(() => {
      setShowCallModal(false);
      setSuccessMessage('');
      loadData();
    }, 1500);
  };

  const filteredFollowups = (followupData?.followups || []).filter(f => {
    const matchChannel = filterChannel === 'ALL' || (filterChannel === 'AUTOMATED' ? f.channel.includes('WhatsApp') || f.channel.includes('IVR') : f.channel.includes('Assisted') || f.channel.includes('Call'));
    const matchCheckpoint = filterCheckpoint === 'ALL' || f.checkpoint === filterCheckpoint;
    const matchSearch = (f.candidateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.candidateDistrict || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchChannel && matchCheckpoint && matchSearch;
  });

  return (
    <SidebarLayout sidebarItems={GOVERNMENT_NAV} roleName="Government Portal" roleColor="orange">
      <div className="space-y-6 animate-fadeInUp">
        
        {/* Header */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
              Longitudinal Monitoring Directorate
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">Automated & Assisted Follow-Up Engine</h1>
            <p className="text-xs text-slate-500 font-medium">WhatsApp Bots · IVR Telephony · Call-Center Verification at Day 30, 90, 180 & 365</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCallModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Log Assisted Call
            </button>
            <button
              onClick={loadData}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-bold text-center animate-fadeIn">
            {successMessage}
          </div>
        )}

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase">Total Follow-Ups</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{followupData?.totalFollowups || 0}</p>
            <p className="text-[11px] text-slate-500">Day 30 to 365 Checkpoints</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase">Automated (WhatsApp/IVR)</span>
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-700">{followupData?.automatedCount || 0}</p>
            <p className="text-[11px] text-blue-600 font-semibold">Zero Human Effort Scale</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase">Assisted Calls (Officers)</span>
              <PhoneCall className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-2xl font-black text-orange-700">{followupData?.assistedCount || 0}</p>
            <p className="text-[11px] text-orange-600 font-semibold">Deep Quality Verification</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-extrabold uppercase">Avg Satisfaction</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600">{followupData?.avgSatisfaction || '4.8'} / 5.0</p>
            <p className="text-[11px] text-emerald-700 font-bold">High Trainee Morale</p>
          </div>
        </div>

        {/* Quick Trigger Simulator Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 rounded-3xl text-white space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest">
                Interactive Multi-Channel Telephony Simulator
              </span>
              <h2 className="text-sm font-black">Dispatch Automated Longitudinal Survey</h2>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
              AI WhatsApp Bot + IVR Active
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {candidates.slice(0, 4).map(c => (
              <button
                key={c.candidateId}
                onClick={() => handleTriggerAutomated(c.candidateId, 'Day 90', 'WhatsApp Automated Bot')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-blue-400" /> WhatsApp Survey: {c.name} ({c.district})
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name, district, or survey notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Channel:</span>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700"
            >
              <option value="ALL">All Channels</option>
              <option value="AUTOMATED">WhatsApp / IVR Bot</option>
              <option value="ASSISTED">Assisted Call-Center</option>
            </select>

            <span className="text-slate-400 font-bold ml-2">Checkpoint:</span>
            <select
              value={filterCheckpoint}
              onChange={(e) => setFilterCheckpoint(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700"
            >
              <option value="ALL">All Checkpoints</option>
              <option value="Day 30">Day 30</option>
              <option value="Day 90">Day 90</option>
              <option value="Day 180">Day 180</option>
              <option value="Day 365">Day 365</option>
            </select>
          </div>
        </div>

        {/* Follow-up Records Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-orange-600" /> Longitudinal Follow-Up Records & Trainee Feedback Log
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              Showing {filteredFollowups.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Channel & Checkpoint</th>
                  <th className="p-3">Reported Status</th>
                  <th className="p-3">Current Wage</th>
                  <th className="p-3">Satisfaction</th>
                  <th className="p-3">Interviewer Notes</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredFollowups.map((f, i) => (
                  <tr key={f.followupId || i} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{f.candidateName}</p>
                      <p className="text-[10px] text-slate-400">{f.candidateMobile}</p>
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[10px]">{f.candidateDistrict || 'Maharashtra'}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 w-fit ${
                        f.channel.includes('WhatsApp') || f.channel.includes('Bot')
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-orange-50 text-orange-800 border border-orange-200'
                      }`}>
                        {f.channel.includes('WhatsApp') ? <Bot className="w-3 h-3" /> : <PhoneCall className="w-3 h-3" />}
                        {f.channel} · {f.checkpoint}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                        f.status.includes('Employed') || f.status.includes('Retained') || f.status.includes('Active')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {f.salaryReported ? `₹${Number(f.salaryReported).toLocaleString('en-IN')}/mo` : 'N/A'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <span>★ {f.satisfactionScore || 5}/5</span>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-slate-600 max-w-xs truncate">
                      {f.notes}
                      {f.officerName && <p className="text-[9px] text-slate-400 font-medium">By: {f.officerName}</p>}
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[10px]">{f.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assisted Call Modal */}
        {showCallModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                    State Call-Center Verification
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">Log Assisted Phone Interview</h3>
                  <p className="text-xs text-slate-500">Capture longitudinal retention, wage progression, and satisfaction</p>
                </div>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-black p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAssistedCall} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Candidate</label>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                  >
                    {candidates.map(c => (
                      <option key={c.candidateId} value={c.candidateId}>
                        {c.name} ({c.candidateId} · {c.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Longitudinal Checkpoint</label>
                    <select
                      value={checkpoint}
                      onChange={(e) => setCheckpoint(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                    >
                      <option value="Day 30">Day 30 (1 Month)</option>
                      <option value="Day 90">Day 90 (3 Months)</option>
                      <option value="Day 180">Day 180 (6 Months)</option>
                      <option value="Day 365">Day 365 (1 Year)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Assisted Officer Name</label>
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Reported Employment Status</label>
                    <select
                      value={employmentStatus}
                      onChange={(e) => setEmploymentStatus(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                    >
                      <option value="EMPLOYED VERIFIED">Wage Employed (Retained)</option>
                      <option value="SELF EMPLOYED VERIFIED">Self-Employed (Active)</option>
                      <option value="APPRENTICESHIP ACTIVE">Apprenticeship Active</option>
                      <option value="ATTRITION FLAGGED / REMEDIAL ACTION">Job Dropped Out (Needs Support)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Current Monthly Earnings (₹)</label>
                    <input
                      type="number"
                      value={salaryReported}
                      onChange={(e) => setSalaryReported(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trainee Job Satisfaction (1 to 5 Stars)</label>
                  <select
                    value={satisfactionScore}
                    onChange={(e) => setSatisfactionScore(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option value={5}>★★★★★ (5/5) Very Satisfied & Growing</option>
                    <option value={4}>★★★★☆ (4/5) Satisfied</option>
                    <option value={3}>★★★☆☆ (3/5) Neutral / Needs Upskilling</option>
                    <option value={2}>★★☆☆☆ (2/5) Low Wage Discontent</option>
                    <option value={1}>★☆☆☆☆ (1/5) Relocation / Working Condition Issue</option>
                  </select>
                </div>

                {employmentStatus.includes('ATTRITION') && (
                  <div>
                    <label className="font-bold text-rose-700 block mb-1">Reason for Non-Placement / Attrition</label>
                    <input
                      type="text"
                      value={attritionReason}
                      onChange={(e) => setAttritionReason(e.target.value)}
                      placeholder="e.g. Low starting wage in metro vs living cost disparity"
                      className="w-full p-2.5 bg-rose-50 border border-rose-300 rounded-xl font-medium focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Interview Call Notes & Verification Summary</label>
                  <textarea
                    rows={3}
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCallModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Save Verification Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
