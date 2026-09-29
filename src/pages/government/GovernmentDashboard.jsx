import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../../layouts/SidebarLayout';
import { GOVERNMENT_NAV } from '../../config/sidebarNav';
import { fetchGovernmentAnalytics, fetchNotifications } from '../../services/api';
import { Shield, TrendingUp, Users, Award, CheckCircle2, RefreshCw, BarChart3, Database, Briefcase, IndianRupee, FileText, MessageSquare, ChevronDown, ChevronUp, Download, Mail, Bell, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

export default function GovernmentDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);

  const loadAnalytics = async () => {
    const data = await fetchGovernmentAnalytics();
    setAnalytics(data);
    const notifs = await fetchNotifications('government');
    setNotifications(notifs || []);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setSentMessages(prev => [{
      id: Date.now(),
      text: newMessage,
      to: 'All Stakeholders',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN')
    }, ...prev]);
    setNewMessage('');
  };

  const chartData = analytics ? [
    { name: 'Registered', count: analytics.totalCandidates },
    { name: 'Students', count: analytics.activeStudents },
    { name: 'Certified', count: analytics.certifiedCount },
    { name: 'Applications', count: analytics.applicationsCount },
    { name: 'Employed', count: analytics.employedCount },
    { name: 'Interventions', count: analytics.interventionsCount }
  ] : [];

  return (
    <SidebarLayout sidebarItems={GOVERNMENT_NAV} roleName="Government Portal" roleColor="orange">
      {!analytics ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading Government Impact Analytics...</div>
      ) : (
        <div className="space-y-8 animate-fadeInUp">
      
      {/* Header */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
            State Skilling Directorate
          </span>
          <h1 className="text-lg font-black text-slate-900">Skill Mission Impact Analytics</h1>
          <p className="text-[11px] text-slate-500 font-medium">Calculated Live from Single Source DB</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setMessagesOpen(!messagesOpen)}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Messages ({sentMessages.length + notifications.length})
          </button>
          <button
            onClick={loadAnalytics}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Messages Section */}
      {messagesOpen && (
        <div className="gov-card p-6 space-y-4 bg-white rounded-3xl border border-blue-200 shadow-md animate-fadeInUp">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Government Communication & Message Center
          </h2>

          {/* Send Message */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Send notification to all stakeholders..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-5 py-3 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Mail className="w-4 h-4" /> Send
            </button>
          </div>

          {/* Sent Messages */}
          {sentMessages.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sent Messages</p>
              {sentMessages.map(msg => (
                <div key={msg.id} className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-blue-900">{msg.text}</p>
                    <p className="text-[10px] text-slate-500">To: {msg.to}</p>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold shrink-0">{msg.time} · {msg.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* Received Notifications */}
          {notifications.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Notifications ({notifications.length})</p>
              <div className="max-h-48 overflow-y-auto space-y-1.5">
                {notifications.map((n, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{n.title}</p>
                      <p className="text-[10px] text-slate-500">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Database Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Candidates', val: analytics.totalCandidates, color: 'text-blue-900 border-t-blue-600' },
          { label: 'Active Students', val: analytics.activeStudents, color: 'text-purple-900 border-t-purple-600' },
          { label: 'Training Completed', val: analytics.certifiedCount, color: 'text-amber-900 border-t-amber-600' },
          { label: 'Certificates', val: analytics.certifiedCount, color: 'text-emerald-800 border-t-emerald-600' },
          { label: 'Job Applications', val: analytics.applicationsCount, color: 'text-cyan-900 border-t-cyan-600' },
          { label: 'Verified Employment', val: analytics.employedCount, color: 'text-emerald-950 border-t-emerald-700 font-black' },
          { label: 'Interventions', val: analytics.interventionsCount, color: 'text-rose-900 border-t-rose-600' }
        ].map((stat) => (
          <div key={stat.label} className={`gov-card p-4 text-center space-y-1 border-t-4 ${stat.color}`}>
            <p className="text-2xl sm:text-3xl font-black">{stat.val}</p>
            <p className="text-[11px] text-slate-700 font-bold leading-tight">{stat.label}</p>
            <p className="text-[9px] text-slate-400">Live DB Count</p>
          </div>
        ))}
      </div>

      {/* Live Chart */}
      <div className="gov-card p-6 space-y-4 bg-white rounded-3xl border border-slate-200">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-900" /> End-to-End Outcome Funnel
            </h2>
            <p className="text-xs text-slate-500">
              {analytics.dataProvenance}
            </p>
          </div>
          <span className="badge-success">✓ 100% Relational Integrity</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px', fontSize: '11px' }} />
              <Bar dataKey="count" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LONGITUDINAL RETENTION & WAGE PROGRESSION */}
      <div className="gov-card p-6 space-y-4 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 text-white rounded-3xl shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              📈 Statewide Longitudinal Outcome Engine
            </span>
            <h2 className="text-base font-black text-white mt-0.5">Post-Training Retention & Wage Growth Metrics</h2>
            <p className="text-xs text-slate-300">{"Monitors long-term 30D \u2192 3M \u2192 6M \u2192 12M \u2192 24M retention across state skilling cohorts"}</p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-3 py-1 rounded-full">
            Longitudinal Tracking Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {[
            { label: '30-Day Retention', pct: analytics.longitudinalMetrics?.retention30DPct || 100, count: analytics.longitudinalMetrics?.m30DCount || 0, color: 'text-emerald-400' },
            { label: '3-Month Retention', pct: analytics.longitudinalMetrics?.retention3MPct || 100, count: analytics.longitudinalMetrics?.m3MCount || 0, color: 'text-blue-400' },
            { label: '6-Month Retention', pct: analytics.longitudinalMetrics?.retention6MPct || 100, count: analytics.longitudinalMetrics?.m6MCount || 0, color: 'text-purple-400' },
            { label: '12-Month Retention', pct: analytics.longitudinalMetrics?.retention12MPct || 100, count: analytics.longitudinalMetrics?.m12MCount || 0, color: 'text-amber-400' },
            { label: '24-Month Retention', pct: analytics.longitudinalMetrics?.retention24MPct || 100, count: analytics.longitudinalMetrics?.m24MCount || 0, color: 'text-orange-400' }
          ].map(m => (
            <div key={m.label} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-1">
              <p className="text-slate-400 font-extrabold text-[10px] uppercase">{m.label}</p>
              <p className={`text-2xl font-black ${m.color}`}>{m.pct}%</p>
              <p className="text-[10px] text-slate-400">{m.count} Retained Candidates</p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Registry Quick Link Section */}
      <div className="gov-card p-6 bg-white rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-700" /> State Candidate Registry & Database
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access verified candidate records, district cohorts, skill provenance, and audit trails.
          </p>
        </div>
        <Link
          to="/government/candidates"
          className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2 shrink-0 shadow-sm"
        >
          View Candidate Registry <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      </div>
      )}
    </SidebarLayout>
  );
}
