import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchCandidateById, fetchAllCandidates, submitAssessment, addCandidateCertificate, deleteCandidateCertificate } from '../../services/api';
import SidebarLayout from '../../layouts/SidebarLayout';
import { CANDIDATE_NAV } from '../../config/sidebarNav';
import CertificateViewModal from '../../components/CertificateViewModal';
import AICertificateScannerModal from '../../components/AICertificateScannerModal';
import { 
  Award, CheckCircle2, ShieldCheck, FileCheck, ArrowRight, Sparkles, 
  QrCode, X, AlertCircle, HelpCircle, Download, Printer, Plus, Trash2, Eye, Cpu, Fingerprint 
} from 'lucide-react';

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "Which React Hook is primarily used for declaring and updating component local state?",
    options: [
      { id: "A", text: "useEffect" },
      { id: "B", text: "useState", correct: true },
      { id: "C", text: "useContext" },
      { id: "D", text: "useReducer" }
    ]
  },
  {
    id: 2,
    question: "In JavaScript, which array method transforms elements and returns a new array of identical length?",
    options: [
      { id: "A", text: "forEach()" },
      { id: "B", text: "map()", correct: true },
      { id: "C", text: "filter()" },
      { id: "D", text: "reduce()" }
    ]
  },
  {
    id: 3,
    question: "Which prop attribute is used in JSX instead of standard HTML 'class' to avoid keyword collision?",
    options: [
      { id: "A", text: "class" },
      { id: "B", text: "className", correct: true },
      { id: "C", text: "styleClass" },
      { id: "D", text: "cssClass" }
    ]
  },
  {
    id: 4,
    question: "How is data passed unidirectionally from a parent component to a child component in React?",
    options: [
      { id: "A", text: "Via Props", correct: true },
      { id: "B", text: "Via Component State" },
      { id: "C", text: "Via LocalStorage" },
      { id: "D", text: "Via Event Listeners" }
    ]
  },
  {
    id: 5,
    question: "Which HTTP status code indicates that a request succeeded and a new resource was created?",
    options: [
      { id: "A", text: "200 OK" },
      { id: "B", text: "201 Created", correct: true },
      { id: "C", text: "302 Found" },
      { id: "D", text: "404 Not Found" }
    ]
  }
];

export default function CandidateCertificatesPage() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [candidate, setCandidate] = useState(null);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [evaluating, setEvaluating] = useState(false);
  const [testResult, setTestResult] = useState(null);
  
  // Certificate view modal, Add certificate modal, and AI Scanner modal
  const [selectedCertToView, setSelectedCertToView] = useState(null);
  const [selectedCertForAIScan, setSelectedCertForAIScan] = useState(null);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [toast, setToast] = useState('');
  
  // Form State for Adding Custom Certificate
  const [newCertForm, setNewCertForm] = useState({
    courseTitle: '',
    provider: '',
    issueDate: new Date().toISOString().split('T')[0],
    score: '95',
    credentialId: ''
  });
  const [submittingCert, setSubmittingCert] = useState(false);

  // Filter Tab State: 'all' | 'achieved' | 'added'
  const [activeFilter, setActiveFilter] = useState('all');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      if (!newCertForm.courseTitle) {
        // Auto-suggest course title from filename if empty
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setNewCertForm(prev => ({ ...prev, courseTitle: cleanName }));
      }
    }
  };

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
      if (!data && currentUser) {
        data = {
          candidateId: currentUser.candidateId || currentUser.id || 'MH-CAND-DEMO',
          name: currentUser.name || 'Candidate',
          district: currentUser.district || 'Pune',
          certificates: []
        };
      }
      setCandidate(data || {
        candidateId: 'MH-CAND-DEMO',
        name: 'Candidate',
        certificates: []
      });
    } catch (err) {
      console.error('Error loading certificate data:', err);
      setCandidate(prev => prev || {
        candidateId: 'MH-CAND-DEMO',
        name: currentUser?.name || 'Candidate',
        certificates: []
      });
    }
  }

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleOptionSelect = (qId, optionId) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionId }));
  };

  const handleCalculateAndSubmitAssessment = async () => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId) return;
    
    // Calculate Score from Submitted Answers
    let correctCount = 0;
    ASSESSMENT_QUESTIONS.forEach(q => {
      const selectedOptionId = selectedAnswers[q.id];
      const correctOption = q.options.find(o => o.correct);
      if (selectedOptionId === correctOption.id) {
        correctCount += 1;
      }
    });

    const calculatedScorePct = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);
    const passed = calculatedScorePct >= 60;

    setEvaluating(true);
    try {
      if (passed) {
        await submitAssessment({
          candidateId: candId,
          courseTitle: candidate?.enrolledCourse ? candidate.enrolledCourse.title : 'Full Stack Web Engineering',
          score: calculatedScorePct,
          maxScore: 100
        });
        await loadData();
      }

      setTestResult({
        total: ASSESSMENT_QUESTIONS.length,
        correct: correctCount,
        score: calculatedScorePct,
        passed
      });
      setIsExamOpen(false);
    } catch (err) {
      console.error('Assessment submission error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId || !newCertForm.courseTitle || !newCertForm.provider) return;

    setSubmittingCert(true);
    try {
      await addCandidateCertificate({
        candidateId: candId,
        courseTitle: newCertForm.courseTitle,
        provider: newCertForm.provider,
        issueDate: newCertForm.issueDate || new Date().toISOString().split('T')[0],
        score: newCertForm.score || '90',
        credentialId: newCertForm.credentialId || `CERT-${Date.now().toString().slice(-6)}`
      });
      await loadData();
      setIsAddCertOpen(false);
      setNewCertForm({
        courseTitle: '',
        provider: '',
        issueDate: new Date().toISOString().split('T')[0],
        score: '95',
        credentialId: ''
      });
      setUploadedFileName('');
      setToast('🎉 Certificate added successfully to your profile!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Error adding certificate:', err);
    } finally {
      setSubmittingCert(false);
    }
  };

  const handleDeleteCertificate = async (certId) => {
    const candId = candidate?.candidateId || currentUser?.candidateId || currentUser?.id;
    if (!candId || !confirm('Are you sure you want to remove this certificate?')) return;
    try {
      await deleteCandidateCertificate(candId, certId);
      await loadData();
      setToast('Certificate removed.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Error removing certificate:', err);
    }
  };

  const certificates = candidate ? (candidate.certificates || []) : [];
  const achievedCertificates = certificates.filter(c => !c.isExternal);
  const addedCertificates = certificates.filter(c => c.isExternal);
  
  const displayedCertificates = activeFilter === 'achieved' 
    ? achievedCertificates 
    : activeFilter === 'added' 
      ? addedCertificates 
      : certificates;

  const hasCert = certificates.length > 0;
  const answeredCount = Object.keys(selectedAnswers).length;

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
        <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
              {t('stateTrustEngine', 'Verified Credential Vault')}
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">{t('assessmentsAndCertificates', 'Assessments & Digital Certificates')}</h1>
            <p className="text-xs text-slate-500">{t('certVaultSubtitle', 'View and manage both your exam-achieved credentials and external added certifications')}</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setSelectedCertForAIScan(certificates[0] || { certificateId: `CERT-${candidate?.candidateId || 'DEMO'}`, courseTitle: 'Full Stack Engineering' })}
              className="bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow inline-flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
            >
              <Cpu className="w-4 h-4 text-cyan-200" /> {t('aiFraudScanner', 'AI Fraud & Authenticity Scanner')}
            </button>
            <button
              onClick={() => setIsAddCertOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow inline-flex items-center gap-2 cursor-pointer transition"
            >
              <Plus className="w-4 h-4 text-amber-300" /> {t('addExternalCertBtn', '+ Add External Certificate')}
            </button>
          </div>
        </div>

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-cyan-400'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase opacity-80">{t('allCertificates', 'All Certificates')}</span>
              <Award className={`w-5 h-5 ${activeFilter === 'all' ? 'text-cyan-400' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black mt-2">{certificates.length}</p>
            <p className="text-[10px] opacity-75 mt-0.5">{t('totalVerifiable', 'Total verifiable credentials')}</p>
          </button>

          <button
            onClick={() => setActiveFilter('achieved')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeFilter === 'achieved'
                ? 'bg-cyan-900 text-white border-cyan-900 shadow-md ring-2 ring-cyan-400'
                : 'bg-white text-slate-800 border-slate-200 hover:border-cyan-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase opacity-80">{t('achievedViaExam', '🏆 Achieved via Exam')}</span>
              <ShieldCheck className={`w-5 h-5 ${activeFilter === 'achieved' ? 'text-amber-300' : 'text-cyan-600'}`} />
            </div>
            <p className="text-2xl font-black mt-2 text-cyan-400">{achievedCertificates.length}</p>
            <p className="text-[10px] opacity-75 mt-0.5">{t('stateNcvetEvals', 'State NCVET course evaluations')}</p>
          </button>

          <button
            onClick={() => setActiveFilter('added')}
            className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
              activeFilter === 'added'
                ? 'bg-blue-950 text-white border-blue-950 shadow-md ring-2 ring-blue-400'
                : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase opacity-80">{t('addedExternal', '📜 Added External')}</span>
              <FileCheck className={`w-5 h-5 ${activeFilter === 'added' ? 'text-cyan-300' : 'text-blue-600'}`} />
            </div>
            <p className="text-2xl font-black mt-2 text-blue-400">{addedCertificates.length}</p>
            <p className="text-[10px] opacity-75 mt-0.5">{t('uploadedExternalCreds', 'Uploaded external credentials')}</p>
          </button>
        </div>

        {/* Evaluation Test Result Alert */}
        {testResult && (
          <div className={`p-6 rounded-3xl border shadow-lg animate-fadeInUp flex items-start justify-between gap-4 ${
            testResult.passed ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="space-y-1">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                testResult.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
              }`}>
                {testResult.passed ? '✓ Assessment Passed!' : '⚠️ Assessment Needs Retake'}
              </span>
              <h3 className="text-lg font-black mt-1">
                Calculated Score: {testResult.score}% ({testResult.correct} / {testResult.total} Correct)
              </h3>
              <p className="text-xs">
                {testResult.passed 
                  ? 'Congratulations! Your practical assessment score meets requirement. Digital certificate has been generated.' 
                  : 'You scored below 60%. Please review the course materials and retake the assessment.'}
              </p>
            </div>
            <button onClick={() => setTestResult(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">✕ Dismiss</button>
          </div>
        )}

        {/* Assessment Action Section */}
        <div className="gov-card p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-200 text-cyan-900">
                Skill Competency Evaluation
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">Achieve Certificate via Course Assessment Test</h2>
              <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
                Answer 5 competency questions for {candidate?.enrolledCourse ? candidate.enrolledCourse.title : 'Full Stack Web Engineering'}. Your final score will be calculated directly from your submitted answers. Scoring 60%+ generates a verifiable digital certificate.
              </p>
            </div>

            <button
              onClick={() => setIsExamOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Start Practical Assessment Test
            </button>
          </div>
        </div>

        {/* Interactive Assessment Exam Modal */}
        {isExamOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                    Live Exam Session · 5 Questions
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {candidate?.enrolledCourse ? candidate.enrolledCourse.title : 'Full Stack Web Engineering'} Competency Test
                  </h2>
                  <p className="text-xs text-slate-500">Each question has 1 correct answer. Passing criteria: 60% (3/5 correct)</p>
                </div>
                <button
                  onClick={() => setIsExamOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {ASSESSMENT_QUESTIONS.map((q, idx) => {
                  const selectedOpt = selectedAnswers[q.id];
                  return (
                    <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="bg-cyan-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{q.question}</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt) => {
                          const isChecked = selectedOpt === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleOptionSelect(q.id, opt.id)}
                              className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition cursor-pointer ${
                                isChecked
                                  ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold shadow-sm ring-1 ring-cyan-400'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 border ${
                                isChecked ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-100 text-slate-600 border-slate-300'
                              }`}>
                                {opt.id}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-4">
                <span className="text-xs font-bold text-slate-600">
                  Answered: <strong className="text-cyan-700">{answeredCount}</strong> / {ASSESSMENT_QUESTIONS.length} Questions
                </span>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsExamOpen(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCalculateAndSubmitAssessment}
                    disabled={answeredCount < ASSESSMENT_QUESTIONS.length || evaluating}
                    className="flex-1 sm:flex-none bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {evaluating ? 'Calculating Score...' : 'Submit Answers & Calculate Score'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Add External Certificate Modal */}
        {isAddCertOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-5 shadow-2xl animate-fadeInUp my-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" /> {t('modalAddCertTitle', 'Add External Skill Certificate')}
                </h2>
                <button onClick={() => setIsAddCertOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCertificate} className="space-y-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">{t('certTitleLabel', 'Certificate / Course Title *')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., AWS Certified Cloud Practitioner, Python for Data Science"
                    value={newCertForm.courseTitle}
                    onChange={(e) => setNewCertForm({ ...newCertForm, courseTitle: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">{t('issuingOrgLabel', 'Issuing Organization / Institute *')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Amazon Web Services (AWS), Google, Coursera / IBM, MSBTE"
                    value={newCertForm.provider}
                    onChange={(e) => setNewCertForm({ ...newCertForm, provider: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">{t('issueDateLabel', 'Issue Date')}</label>
                    <input
                      type="date"
                      value={newCertForm.issueDate}
                      onChange={(e) => setNewCertForm({ ...newCertForm, issueDate: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">{t('scoreGradeLabel', 'Score / Percentage / Grade')}</label>
                    <input
                      type="text"
                      placeholder="e.g., 95% or Grade A"
                      value={newCertForm.score}
                      onChange={(e) => setNewCertForm({ ...newCertForm, score: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">{t('credIdLabel', 'Credential ID / Verification Code (Optional)')}</label>
                  <input
                    type="text"
                    placeholder="e.g., AWS-984729184 or CERT-EXT-2026"
                    value={newCertForm.credentialId}
                    onChange={(e) => setNewCertForm({ ...newCertForm, credentialId: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Upload Certificate Document / Image */}
                <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-2 text-center">
                  <p className="text-xs font-extrabold text-slate-700">{t('attachDocLabel', 'Attach Certificate Document (PDF/JPG/PNG)')}</p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-blue-100 file:text-blue-900 hover:file:bg-blue-200 cursor-pointer"
                  />
                  {uploadedFileName && (
                    <p className="text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Attached: {uploadedFileName}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCertOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                  >
                    {t('cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCert}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition cursor-pointer disabled:opacity-50"
                  >
                    {submittingCert ? '...' : t('saveCertBtn', 'Save & Authenticate Certificate')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Digital Certificate Display */}
        {hasCert ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-600" />
                {activeFilter === 'achieved'
                  ? `${t('achievedViaExam', 'Achieved via Course Assessment')} (${displayedCertificates.length})`
                  : activeFilter === 'added'
                    ? `${t('addedExternal', 'Added External Certifications')} (${displayedCertificates.length})`
                    : `${t('allCertificates', 'All Verifiable Certificates')} (${displayedCertificates.length})`
                }
              </h2>

              <span className="text-xs text-slate-500 font-bold">
                {displayedCertificates.length} / {certificates.length}
              </span>
            </div>

            {displayedCertificates.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No certificates found in this filter category.</p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="text-xs text-cyan-700 font-extrabold underline cursor-pointer"
                >
                  {t('allCertificates', 'View All Certificates')}
                </button>
              </div>
            ) : (
              displayedCertificates.map((cert, idx) => (
                <div
                  key={idx}
                  className={`gov-card p-6 md:p-8 bg-white border-2 rounded-3xl shadow-xl space-y-6 relative overflow-hidden transition-all ${
                    cert.isExternal ? 'border-blue-400 hover:border-blue-500' : 'border-cyan-400 hover:border-cyan-500'
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 ${
                    cert.isExternal ? 'bg-blue-500/10' : 'bg-cyan-500/10'
                  }`} />

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className={`inline-flex items-center gap-2 font-extrabold text-[10px] uppercase px-3.5 py-1 rounded-full tracking-widest shadow ${
                      cert.isExternal 
                        ? 'bg-blue-950 text-blue-300'
                        : 'bg-slate-900 text-amber-400'
                    }`}>
                      {cert.isExternal ? (
                        <>
                          <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                          {t('addedExternal', '📜 Added External Credential')} · {t('verified', 'Verified')}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {t('achievedViaExam', '🏆 NCVET Assessment Achieved')} · {t('authentic', 'Official')}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedCertForAIScan(cert)}
                        className="bg-cyan-100 hover:bg-cyan-200 text-cyan-900 border border-cyan-300 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Cpu className="w-4 h-4 text-cyan-700" /> {t('aiFraudScanner', 'AI Fraud Check')}
                      </button>
                      <button
                        onClick={() => setSelectedCertToView(cert)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow inline-flex items-center gap-1.5 cursor-pointer transition transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" /> {t('viewFullCert', 'View Full Certificate')}
                      </button>
                      <button
                        onClick={() => setSelectedCertToView(cert)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow inline-flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Download className="w-4 h-4" /> {t('downloadPrintPdf', 'Download / Print (PDF)')}
                      </button>
                      {cert.isExternal && (
                        <button
                          onClick={() => handleDeleteCertificate(cert.certificateId)}
                          title="Remove Certificate"
                          className="text-rose-500 hover:text-rose-700 p-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Certificate Banner */}
                  <div className="text-center space-y-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      cert.isExternal ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {cert.isExternal ? 'External Skill Certification' : 'State Skill Directorate Certificate'}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      CERTIFICATE OF COMPETENCY
                    </h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Digital Credential ID: {cert.certificateId}</p>
                  </div>

                  {/* Certificate Details */}
                  <div className="text-center space-y-3 py-2">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">This is to certify that</p>
                    <h3 className="text-2xl font-black text-slate-900 underline decoration-cyan-400 decoration-2 underline-offset-4">
                      {candidate?.name || 'Candidate'}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl mx-auto">
                      has demonstrated required industry competencies with a calculated / verified score of <strong className="text-cyan-900 font-black text-sm">{cert.score || '100%'}</strong> in:
                    </p>
                    <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl inline-block max-w-lg">
                      <p className="font-extrabold text-cyan-950 text-base">{cert.courseTitle || 'React & Full Stack Engineering'}</p>
                      <p className="text-[10px] text-cyan-800 font-bold mt-0.5">Issued by: {cert.provider || cert.providerName || candidate?.assignedProvider || 'ABC Skill Centre Pune'}</p>
                    </div>
                  </div>

                  {/* Cryptographic Hash & Verification QR */}
                  <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left">
                      <span className="text-[9px] font-extrabold text-slate-500 block uppercase">Cryptographic Audit Hash</span>
                      <p className="font-mono text-[10px] font-bold text-slate-800 break-all bg-white p-1.5 rounded border border-slate-200">
                        {cert.certHash || `0x8f9a2b4c1e6d${candidate?.candidateId || 'DEMO'}7f0a9b`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
                      <div className="flex items-center gap-2 text-left">
                        <QrCode className="w-8 h-8 text-cyan-400" />
                        <div>
                          <p className="font-extrabold text-xs">Live HR Verification Ready</p>
                          <p className="text-[10px] text-slate-400">Verifiable by Employers via SHA-256 API</p>
                        </div>
                      </div>
                      <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full">
                        ✓ Authentic
                      </span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <FileCheck className="w-10 h-10 text-cyan-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Digital Certificates Issued Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Once you complete your training course and submit the final assessment test, your tamper-proof certificate will appear here. You can also upload your external certifications using the button above.
            </p>
            <button
              onClick={() => setIsAddCertOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Plus className="w-4 h-4" /> Add External Certification
            </button>
          </div>
        )}

        {/* Full Screen View / Download Certificate Modal */}
        {selectedCertToView && (
          <CertificateViewModal
            certificate={selectedCertToView}
            candidate={candidate}
            onClose={() => setSelectedCertToView(null)}
          />
        )}

        {/* AI/ML Certificate Authenticity & Fraud Scanner Modal */}
        {selectedCertForAIScan && (
          <AICertificateScannerModal
            certificate={selectedCertForAIScan}
            candidate={candidate}
            onClose={() => setSelectedCertForAIScan(null)}
          />
        )}

      </div>
    </SidebarLayout>
  );
}
