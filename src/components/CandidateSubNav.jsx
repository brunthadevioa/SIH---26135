import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User, Sparkles, BookOpen, Camera, Award, Briefcase, TrendingUp, ShieldCheck, MessageSquare
} from 'lucide-react';

export default function CandidateSubNav() {
  const location = useLocation();

  const navItems = [
    { path: '/candidate/skills', label: 'Skill Gap & Provenance', icon: Sparkles, color: 'text-purple-400' },
    { path: '/candidate/training', label: 'Courses & Enrollment', icon: BookOpen, color: 'text-amber-400' },
    { path: '/candidate/attendance', label: 'Real Camera Attendance', icon: Camera, color: 'text-emerald-400' },
    { path: '/candidate/certificates', label: 'Assessment & Certificates', icon: Award, color: 'text-cyan-400' },
    { path: '/candidate/jobs', label: 'Job Marketplace & Apply', icon: Briefcase, color: 'text-blue-300' },
    { path: '/candidate/longitudinal', label: 'Longitudinal Wage Tracking', icon: TrendingUp, color: 'text-emerald-300' },
    { path: '/candidate/messages', label: 'Messages', icon: MessageSquare, color: 'text-orange-400' },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 overflow-x-auto no-scrollbar shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-1.5 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white shadow-md border border-blue-700 font-extrabold ring-1 ring-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.color}`} />
              <span>{item.label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

