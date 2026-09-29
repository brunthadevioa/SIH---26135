import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerCandidate } from '../../services/api';
import {
  User, Shield, ArrowRight, CheckCircle2, AlertCircle, Sparkles,
  Upload, FileText, X, Plus, Lock, Award, BookOpen
} from 'lucide-react';

const PRESET_SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'Flutter', 'Dart', 'Firebase',
  'Python', 'SQL', 'AutoCAD', 'CNC Machining', 'Digital Marketing'
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [educationLevel, setEducationLevel] = useState('Bachelor of Computer Applications (BCA)');
  const [courseInterest, setCourseInterest] = useState('Software & Web Development');

  // Skills
  const [selectedSkills, setSelectedSkills] = useState(['HTML', 'CSS', 'JavaScript', 'Flutter', 'Dart']);
  const [customSkill, setCustomSkill] = useState('');

  // Resume file name
  const [resumeName, setResumeName] = useState('Resume_Bruntha.pdf');
  const [consent, setConsent] = useState(true);

  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginAsUser } = useAuth();
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Please agree to the data usage and privacy policy to register.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerCandidate({
        fullName,
        email,
        mobile,
        password,
        district,
        educationLevel,
        courseInterest,
        skills: selectedSkills,
        resumeName,
        consent
      });

      if (res.user && res.candidate) {
        loginAsUser(res.user);
        setToast(`🎉 Account Created! Generated Candidate ID: ${res.candidate.candidateId}`);
        setTimeout(() => {
          navigate('/candidate/skills');
        }, 1200);
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please check backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8 animate-fadeInUp">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-amber-300" /> {toast}
        </div>
      )}

      <div className="gov-card p-6 sm:p-10 w-full max-w-2xl space-y-8 bg-white border border-slate-200 shadow-xl rounded-3xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 to-blue-600 text-white mx-auto flex items-center justify-center font-bold text-xl shadow-md">
            🚩
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Candidate Registration</h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Create your candidate profile in MahaSkill 360 database. System will generate your dynamic Candidate ID.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Mandatory Rule 1: Public Registration for Candidate ONLY */}
        <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-700" /> I am registering as:
            </span>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              ● Candidate (Public)
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Note for Judges:</strong> Candidate is the only public registration role. Provider, Trainer, HR, and Government accounts are predefined demo logins accessible via the Login page.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs">
          
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-800" /> 1. Personal Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Bruntha Patil / Devi Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="bruntha@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                <input
                  type="text"
                  placeholder="+91 98230 45678"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">District Location</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                  <option value="Thane">Thane</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Educational Qualification</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="Bachelor of Computer Applications (BCA)">Bachelor of Computer Applications (BCA)</option>
                  <option value="B.E. / B.Tech Computer Engineering">B.E. / B.Tech Computer Engineering</option>
                  <option value="Diploma Engineering / ITI">Diploma Engineering / ITI</option>
                  <option value="Higher Secondary (12th Pass)">Higher Secondary (12th Pass)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidate Skills Section */}
          <div className="space-y-3 bg-blue-50/50 border border-blue-200/80 p-4 sm:p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" /> 2. My Skills & Competencies
              </h3>
              <span className="text-[10px] text-blue-800 font-bold bg-blue-100 px-2.5 py-0.5 rounded-full">
                {selectedSkills.length} Selected
              </span>
            </div>

            <p className="text-slate-600 text-[11px] leading-relaxed">
              Select or type your acquired skills (e.g., HTML, CSS, JavaScript, Flutter, Dart, Firebase). System will scan for skill gaps!
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-900 text-white shadow-sm font-bold border border-blue-900'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. Flutter, Firebase)..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Resume Upload Attachment */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-700" /> 3. Upload Resume
            </h3>

            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
              <FileText className="w-6 h-6 text-blue-700 shrink-0" />
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-xs focus:outline-none"
                />
                <p className="text-[10px] text-slate-500">PDF Document · 1.4 MB</p>
              </div>
              <label className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer">
                Browse...
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setResumeName(e.target.files[0].name);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Consent */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
            <span className="font-bold text-blue-950 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-700" /> Outcome Measurement Consent
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              I agree to allow Skill Mission to track post-training employment, skill progression, and longitudinal wage growth outcomes.
            </p>
            <label className="flex items-center gap-2 pt-1 font-semibold text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>I agree to the data usage and privacy policy.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 hover:from-blue-800 hover:to-slate-900 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide"
          >
            {isSubmitting ? 'Creating Candidate Record...' : 'Create Candidate Account & Generate ID'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200">
          <p className="text-slate-600 text-xs">
            Already registered?{' '}
            <Link to="/login" className="text-blue-700 font-bold hover:underline">
              Sign In to Candidate 360
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
