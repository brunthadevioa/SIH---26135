import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCandidateById, fetchAllCandidates, fetchJobs, applyToJob } from '../../services/api';
import SidebarLayout from '../../layouts/SidebarLayout';
import { CANDIDATE_NAV } from '../../config/sidebarNav';
import { 
  Briefcase, CheckCircle2, MapPin, Building2, IndianRupee, Clock, 
  ArrowRight, ShieldCheck, Search, Filter, X, Sparkles 
} from 'lucide-react';
import OfferLetterModal from '../../components/OfferLetterModal';

export default function CandidateJobsPage() {
  const { currentUser } = useAuth();
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'applications'
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  async function loadData() {
    try {
      const [candList, jobList] = await Promise.all([fetchAllCandidates(), fetchJobs()]);
      let targetId = currentUser?.candidateId || currentUser?.id || currentUser?.email || (candList && candList[0] ? candList[0].candidateId : null);
      let data = null;
      if (targetId) {
        data = await fetchCandidateById(targetId);
      }
      if (!data && candList && candList.length > 0) {
        data = candList.find(c => c.candidateId === currentUser?.id || c.email === currentUser?.email) || candList[0];
      }
      if (!data && currentUser) {
        data = {
          candidateId: currentUser.candidateId || currentUser.id || 'MH-CAND-DEMO',
          name: currentUser.name || 'Candidate',
          district: currentUser.district || 'Pune',
          employmentStatus: 'Seeking Employment',
          applications: []
        };
      }
      setCandidate(data || {
        candidateId: 'MH-CAND-DEMO',
        name: 'Candidate',
        employmentStatus: 'Seeking Employment',
        applications: []
      });
      setJobs(jobList || []);
    } catch (err) {
      console.error('Error loading job page data:', err);
      setCandidate(prev => prev || {
        candidateId: 'MH-CAND-DEMO',
        name: currentUser?.name || 'Candidate',
        employmentStatus: 'Seeking Employment',
        applications: []
      });
    }
  }

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleApply = async (jobId) => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId) return;
    setLoading(true);
    try {
      await applyToJob(candId, jobId);
      await loadData();
    } catch (err) {
      console.error('Job application error:', err);
    } finally {
      setLoading(false);
    }
  };

  const appliedJobIds = (candidate?.applications || []).map(a => a.jobId);
  const applications = candidate?.applications || [];
  const isEmployedOrOffered = candidate?.employmentStatus?.includes('EMPLOYED') || candidate?.employmentStatus?.includes('Offer') || candidate?.employmentDetails;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.requiredSkills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocation === 'All' || job.location?.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <SidebarLayout sidebarItems={CANDIDATE_NAV} roleName="Candidate Portal" roleColor="emerald">
      <div className="space-y-6 animate-fadeInUp p-6">
          
        {/* Header with Navigation Tab Switcher */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-black text-slate-900">Job Marketplace &amp; Placements</h1>
            <p className="text-xs text-slate-500">Explore verified corporate openings &amp; track your application status</p>
          </div>

          {/* View Tab Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'marketplace'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Explore Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> My Applications ({applications.length})
            </button>
          </div>
        </div>

        {/* Offer Letter Banner if Offered / Employed */}
        {isEmployedOrOffered && (
          <div className="gov-card p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-3xl flex justify-between items-center flex-wrap gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full">
                🎉 Official Corporate Offer Ready
              </span>
              <h2 className="text-base font-black text-slate-900 mt-1">Official Joining Letter Issued</h2>
              <p className="text-xs text-slate-600">Company: <strong>{candidate?.employmentDetails?.company || 'TechCorp India Ltd'}</strong> · Package: <strong>{candidate?.employmentDetails?.salary || '₹3,60,000 / Year'}</strong></p>
            </div>

            <button
              onClick={() => setShowOfferModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition"
            >
              📄 View Offer Letter (PDF)
            </button>
          </div>
        )}

        {/* ── TAB 1: EXPLORE JOB MARKETPLACE ── */}
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            {/* Search & Location Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, skill, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Location Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5 text-blue-600" /> Location:
                </span>
                {['All', 'Pune', 'Mumbai', 'Nashik', 'Bangalore', 'Remote'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`px-3 py-1 rounded-xl font-bold transition text-xs cursor-pointer ${
                      selectedLocation === loc
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count & Clear */}
            <div className="flex justify-between items-center text-xs text-slate-500 px-1">
              <span>Showing <strong className="text-blue-900 font-black">{filteredJobs.length}</strong> verified corporate vacancies</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Clear search query
                </button>
              )}
            </div>

            {/* Spacious 3-Column Jobs Grid */}
            {filteredJobs.length === 0 ? (
              <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No Jobs Found Matching "{searchQuery}"</p>
                <p className="text-xs text-slate-500">Try searching for other keywords like "React", "Node", "Pune", or clear your filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedLocation('All'); }}
                  className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Clear Search &amp; Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredJobs.map((job) => {
                  const isApplied = appliedJobIds.includes(job.id);
                  return (
                    <div key={job.id} className="gov-card p-5 bg-white rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4 hover:border-blue-400 transition shadow-sm hover:shadow-md">
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                            {job.company}
                          </span>
                          <span className="text-xs font-black text-emerald-700 flex items-center gap-0.5 shrink-0">
                            <IndianRupee className="w-3.5 h-3.5" /> {job.salary}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">{job.title}</h3>

                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {job.location}
                        </p>

                        <div className="pt-1">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Required Skills</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(job.requiredSkills || ['React', 'Node.js']).map(s => (
                              <span key={s} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {isApplied ? (
                        <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-extrabold rounded-xl text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" /> Application Submitted
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={loading}
                          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow cursor-pointer transition disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          Apply for Job <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: MY APPLICATIONS (INDIVIDUAL TAB VIEW) ── */}
        {activeTab === 'applications' && (
          <div className="gov-card p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Clock className="w-5 h-5 text-blue-600" /> Submitted Job Applications &amp; Status
            </h2>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900">
                        Application ID: {app.applicationId || `APP-${idx + 1}`}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">{app.jobTitle || 'Software Engineer'}</h3>
                      <p className="text-xs text-slate-600 font-medium">{app.company || 'TechCorp India Ltd'} · {app.location || 'Pune'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border ${
                        app.status === 'Employed' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' :
                        app.status === 'Offer Extended' ? 'bg-cyan-100 border-cyan-300 text-cyan-900' :
                        app.status === 'Interview Scheduled' ? 'bg-purple-100 border-purple-300 text-purple-900' :
                        'bg-blue-100 border-blue-300 text-blue-900'
                      }`}>
                        {app.status || 'Application Submitted'}
                      </span>
                      {(app.status === 'Employed' || app.status === 'Offer Extended' || isEmployedOrOffered) && (
                        <button
                          onClick={() => setShowOfferModal(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow flex items-center gap-1 cursor-pointer transition"
                        >
                          📄 Offer Letter
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">No Job Applications Submitted Yet</p>
                <p className="text-xs text-slate-500">Switch to the "Explore Jobs" tab to view verified employer openings and submit your application.</p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Browse {jobs.length} Verified Jobs
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Offer Letter Modal */}
      {showOfferModal && candidate && (
        <OfferLetterModal
          candidate={candidate}
          onClose={() => setShowOfferModal(false)}
        />
      )}
    </SidebarLayout>
  );
}
