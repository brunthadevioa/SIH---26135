import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';
import { Shield, User, GraduationCap, Building2, BookOpen, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('candidate');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const { loginAsDemoRole, loginAsUser } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(selectedRole, emailOrId);
      if (res.user) {
        loginAsUser(res.user);
        setToast(`Authenticated as ${res.user.name} (${res.user.role.toUpperCase()})! Redirecting...`);
        setTimeout(() => {
          if (res.user.role === 'candidate') navigate('/candidate/skills');
          else if (res.user.role === 'provider') navigate('/provider/dashboard');
          else if (res.user.role === 'trainer') navigate('/trainer/dashboard');
          else if (res.user.role === 'employer') navigate('/employer/dashboard');
          else navigate('/government/dashboard');
        }, 800);
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please verify credentials or server status.');
    }
  };

  const handleDemoClick = (role) => {
    loginAsDemoRole(role);
    if (role === 'provider') navigate('/provider/dashboard');
    else if (role === 'trainer') navigate('/trainer/dashboard');
    else if (role === 'employer') navigate('/employer/dashboard');
    else if (role === 'government') navigate('/government/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fadeInUp">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="gov-card p-6 sm:p-8 w-full max-w-md space-y-6 bg-white rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white mx-auto flex items-center justify-center font-bold text-xl mb-2 shadow-md">
            🚩
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to MahaSkill 360</h1>
          <p className="text-xs text-slate-500">Access your candidate 360 profile or institutional portal.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select User Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('candidate')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'candidate'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" /> Candidate
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('provider')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'provider'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-600" /> Provider
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('trainer')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'trainer'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" /> Trainer
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('employer')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'employer'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" /> HR Employer
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('government')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedRole === 'government'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-saffron-500" /> Government
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              {selectedRole === 'candidate' ? 'Registered Email or Candidate ID (MH-CAND-XXXXXX)' : 'Official Email / User ID'}
            </label>
            <input
              type="text"
              placeholder={selectedRole === 'candidate' ? 'e.g. bruntha@example.com or MH-CAND-123456' : 'e.g. director@abcskill.org'}
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Need help?</span>
            <Link to="/register" className="text-blue-700 font-bold hover:underline">
              Register Candidate Account →
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            Sign In to Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Predefined Demo Role Switcher for Judging */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Judge Presentation Quick Switcher
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoClick('provider')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 p-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Demo Provider
            </button>
            <button
              onClick={() => handleDemoClick('trainer')}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 p-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Demo Trainer A
            </button>
            <button
              onClick={() => handleDemoClick('employer')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 p-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Demo HR Employer
            </button>
            <button
              onClick={() => handleDemoClick('government')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-300 p-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Demo Government
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
