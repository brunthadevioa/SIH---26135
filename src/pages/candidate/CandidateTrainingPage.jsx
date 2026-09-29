import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCandidateById, fetchAllCandidates, enrollInCourse, unenrollCourse, fetchCourses } from '../../services/api';
import SidebarLayout from '../../layouts/SidebarLayout';
import { CANDIDATE_NAV } from '../../config/sidebarNav';
import { 
  BookOpen, CheckCircle2, Search, Sparkles, Filter, 
  Clock, Award, ArrowRight, UserCheck, Trash2, AlertTriangle, X,
  GraduationCap, Calendar, Video, ShieldCheck, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_COURSES = [
  {
    id: 'crs-react',
    title: 'React Development & Modern Web UI Engineering',
    provider: 'ABC Skill Centre Pune',
    duration: '6 Weeks',
    modules: '12 Modules',
    level: 'Intermediate',
    domain: 'Frontend Web',
    skillsProvided: ['React', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit']
  },
  {
    id: 'crs-node',
    title: 'Node.js Backend Architecture & Microservices',
    provider: 'ABC Skill Centre Pune',
    duration: '6 Weeks',
    modules: '12 Modules',
    level: 'Intermediate',
    domain: 'Backend Systems',
    skillsProvided: ['Node.js', 'Express', 'REST APIs', 'MongoDB', 'PostgreSQL']
  },
  {
    id: 'crs-fullstack',
    title: 'Full Stack Web Architecture & Cloud Deploy',
    provider: 'ABC Skill Centre Pune',
    duration: '12 Weeks',
    modules: '24 Modules',
    level: 'Advanced',
    domain: 'Full Stack Web',
    skillsProvided: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'CI/CD']
  },
  {
    id: 'crs-ai-ml',
    title: 'Applied AI, Machine Learning & Python Data Science',
    provider: 'ABC Skill Centre Pune',
    duration: '8 Weeks',
    modules: '16 Modules',
    level: 'Advanced',
    domain: 'AI & Data Science',
    skillsProvided: ['Python', 'Machine Learning', 'TensorFlow', 'Data Modeling']
  },
  {
    id: 'crs-cloud-devops',
    title: 'Enterprise Cloud Computing, DevOps & CI/CD Pipeline',
    provider: 'ABC Skill Centre Pune',
    duration: '8 Weeks',
    modules: '16 Modules',
    level: 'Advanced',
    domain: 'Cloud & DevOps',
    skillsProvided: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux']
  },
  {
    id: 'crs-cybersecurity',
    title: 'Cybersecurity Analyst & SOC Defense Operations',
    provider: 'ABC Skill Centre Pune',
    duration: '8 Weeks',
    modules: '16 Modules',
    level: 'Intermediate',
    domain: 'Cybersecurity',
    skillsProvided: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Cryptography']
  },
  {
    id: 'crs-mobile',
    title: 'Cross-Platform Mobile App Development with Flutter',
    provider: 'ABC Skill Centre Pune',
    duration: '6 Weeks',
    modules: '12 Modules',
    level: 'Intermediate',
    domain: 'Mobile Development',
    skillsProvided: ['Flutter', 'Dart', 'Firebase', 'Mobile UI']
  }
];

export default function CandidateTrainingPage() {
  const { currentUser } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'explore'
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  async function loadData() {
    try {
      const [candList, courseList] = await Promise.all([fetchAllCandidates(), fetchCourses()]);
      let targetId = currentUser?.candidateId || currentUser?.id || currentUser?.email || (candList && candList[0] ? candList[0].candidateId : null);
      let data = null;
      if (targetId) {
        data = await fetchCandidateById(targetId);
      }
      if (!data && candList && candList.length > 0) {
        data = candList.find(c => c.candidateId === currentUser?.id || c.email === currentUser?.email) || candList[0];
      }
      if (courseList && courseList.length > 0) {
        setCourses(courseList);
      }
      const loadedCand = data || {
        candidateId: currentUser?.candidateId || 'MH-CAND-DEMO',
        name: currentUser?.name || 'Candidate',
        trainingStatus: 'Not Enrolled'
      };
      setCandidate(loadedCand);

      // If user has active course, default to active tab; otherwise explore
      if (!loadedCand.enrolledCourse && activeTab === 'active') {
        setActiveTab('explore');
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  }

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleEnroll = async (courseId) => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id || 'MH-CAND-864788';
    setLoading(true);
    try {
      await enrollInCourse(candId, courseId);
      await loadData();
      setActiveTab('active');
      setToast('🎉 Enrolled in course successfully! Dedicated faculty trainer assigned.');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async () => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId) return;
    setLoading(true);
    try {
      await unenrollCourse(candId);
      setShowCancelModal(false);
      await loadData();
      setActiveTab('explore');
      setToast('✓ Course enrollment cancelled successfully. You can enroll in another program anytime.');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Unenroll error:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentCourse = candidate?.enrolledCourse;
  const domains = ['All', 'Frontend Web', 'Backend Systems', 'Full Stack Web', 'AI & Data Science', 'Cloud & DevOps', 'Cybersecurity', 'Mobile Development'];

  const filteredCourses = courses.filter(crs => {
    const matchesDomain = selectedDomain === 'All' || crs.domain === selectedDomain || crs.level === selectedDomain;
    const matchesSearch = !searchQuery || 
      crs.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crs.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (crs.domain && crs.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crs.skillsProvided && crs.skillsProvided.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesDomain && matchesSearch;
  });

  return (
    <SidebarLayout sidebarItems={CANDIDATE_NAV} roleName="Candidate Portal" roleColor="emerald">
      <div className="space-y-6 animate-fadeInUp p-6">
        
        {/* Toast */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-amber-300" /> {toast}
          </div>
        )}

        {/* ── Top Header with Tab Switcher ── */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Training &amp; Curriculum
            </span>
            <h1 className="text-base font-black text-slate-900 mt-1">Course Management &amp; Enrollment</h1>
            <p className="text-xs text-slate-500">Manage your active accredited coursework or explore technical skilling pathways</p>
          </div>

          {/* Dedicated Tab Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> 
              My Active Course {currentCourse ? '(1)' : '(0)'}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'explore'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" /> 
              Explore Courses ({courses.length})
            </button>
          </div>
        </div>

        {/* ── TAB 1: DEDICATED ACTIVE COURSE SECTION ── */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {currentCourse ? (
              <div className="space-y-6">
                {/* Active Course Banner */}
                <div className="p-6 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
                        ● Currently In Training
                      </span>
                      <h2 className="text-xl font-black text-white mt-1">{currentCourse.title}</h2>
                      <p className="text-xs text-slate-300">
                        Accredited Training Partner: <strong className="text-white">{currentCourse.provider || 'ABC Skill Centre Pune'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Cancel / Drop Course
                      </button>
                    </div>
                  </div>

                  {/* Course Highlights Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                      <p className="font-extrabold text-white text-sm mt-0.5">{currentCourse.duration || '12 Weeks'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Curriculum Depth</span>
                      <p className="font-extrabold text-white text-sm mt-0.5">{currentCourse.modules || '24 Modules'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Level</span>
                      <p className="font-extrabold text-emerald-300 text-sm mt-0.5">{currentCourse.level || 'Intermediate'}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance Status</span>
                      <p className="font-extrabold text-amber-300 text-sm mt-0.5">
                        {candidate?.attendanceHistory?.length || 0} Sessions Logged
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2-Column Detail Cards: Assigned Faculty & Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Faculty Trainer Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                      <UserCheck className="w-4 h-4 text-emerald-600" /> Dedicated Faculty Instructor
                    </h3>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-black text-slate-900 text-sm">
                            {candidate?.assignedTrainer ? candidate.assignedTrainer.name : 'Trainer A (Prof. Rajesh Sharma)'}
                          </p>
                          <p className="text-xs text-purple-900 font-bold mt-0.5">
                            {candidate?.assignedTrainer?.specialization || 'Frontend & Full Stack React UI'}
                          </p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                          ● Assigned &amp; Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Conducts live batch sessions, practical lab evaluations, and camera attendance verification.
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Hub */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Daily Actions &amp; Next Steps
                      </h3>
                      <p className="text-xs text-slate-500 mt-2">
                        Complete your required attendance and assessments to generate your state-accredited cryptographic certificate.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      <Link
                        to="/candidate/attendance"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4" /> Mark Live Camera Attendance →
                      </Link>
                      <Link
                        to="/candidate/certificates"
                        className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4 text-blue-700" /> View Assessment &amp; Certificates →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Skills Delivered in this Course */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Core Competencies Covered
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(currentCourse.skillsProvided || ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'REST APIs']).map(s => (
                      <span key={s} className="bg-purple-50 border border-purple-200 text-purple-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900">No Active Course Enrollment</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You are not currently enrolled in a training cohort. Browse our catalog of 7 accredited technical programs and enroll with 1 click.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" /> Browse Available Courses ({courses.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: EXPLORE & ENROLL COURSE CATALOG ── */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* Search & Domain Filter Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search courses by title, skill (e.g. React, Python, AWS), or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 self-center">
                  Showing <strong>{filteredCourses.length}</strong> of {courses.length} Courses
                </span>
              </div>

              {/* Domain Filter Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {domains.map(dom => (
                  <button
                    key={dom}
                    onClick={() => setSelectedDomain(dom)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                      selectedDomain === dom
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((crs) => {
                const isCurrentlyEnrolled = currentCourse?.id === crs.id;
                return (
                  <div
                    key={crs.id}
                    className={`bg-white rounded-3xl border p-6 space-y-4 flex flex-col justify-between transition hover:shadow-md ${
                      isCurrentlyEnrolled ? 'border-emerald-400 ring-2 ring-emerald-300' : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {crs.domain || 'Skill Track'}
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                          {crs.level || 'Intermediate'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900 text-sm leading-snug">{crs.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-1">Provider: {crs.provider || 'ABC Skill Centre Pune'}</p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold pt-1">
                        <span>⏳ {crs.duration || '6 Weeks'}</span>
                        <span>📚 {crs.modules || '12 Modules'}</span>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Skills Delivered</span>
                        <div className="flex flex-wrap gap-1">
                          {(crs.skillsProvided || []).map(s => (
                            <span key={s} className="bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {isCurrentlyEnrolled ? (
                        <div className="w-full bg-emerald-50 text-emerald-800 font-black text-xs py-2.5 rounded-xl text-center border border-emerald-300 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Enrolled Course
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(crs.id)}
                          disabled={loading}
                          className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> 1-Click Enroll
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cancel Course Confirmation Modal ── */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeInUp">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-slate-900">Cancel Course Enrollment?</h3>
                <p className="text-xs text-slate-600">
                  Are you sure you want to drop <strong>{currentCourse?.title}</strong>? Your progress and assigned trainer will be cleared. You can re-enroll in any program anytime.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl cursor-pointer transition"
                >
                  Keep Enrolled
                </button>
                <button
                  onClick={handleUnenroll}
                  disabled={loading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow transition"
                >
                  {loading ? 'Cancelling...' : 'Yes, Drop Course'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
