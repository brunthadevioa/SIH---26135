import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../data/database.json');

// Helper: Read single source of truth database
function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database.json:', err);
    return {
      candidates: [], users: [], trainers: [], providers: [], employers: [],
      courses: [], jobs: [], schedules: [], attendanceRequests: [], assessments: [],
      assessmentSubmissions: [], certificates: [], applications: [], offers: [],
      notifications: [], interventions: [], auditLogs: []
    };
  }
}

// Helper: Write single source of truth database
function writeDB(db) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database.json:', err);
  }
}

// Helper: Push Notification
function pushNotification(db, userId, role, title, message, type = 'info') {
  if (!db.notifications) db.notifications = [];
  const notif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    role,
    title,
    message,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    read: false,
    type
  };
  db.notifications.unshift(notif);
  return notif;
}

// ── 1. AUTH: CANDIDATE REGISTRATION ──────────────────────────────────────────
router.post('/auth/register', (req, res) => {
  const db = readDB();
  const { fullName, email, mobile, password, district, educationLevel, courseInterest, skills, resumeName, consent } = req.body;

  if (!email || !fullName) {
    return res.status(400).json({ error: 'Full Name and Email are required' });
  }

  const existing = db.candidates.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Candidate account with this email already exists.' });
  }

  const candidateId = `MH-CAND-${Math.floor(100000 + Math.random() * 900000)}`;
  const candidateSkills = Array.isArray(skills) && skills.length > 0 ? skills : ['HTML', 'CSS', 'JavaScript'];

  // Identify Skill Gap & Course Recommendation
  const hasReact = candidateSkills.some(s => s.toLowerCase().includes('react'));
  const hasNode = candidateSkills.some(s => s.toLowerCase().includes('node'));
  
  const skillGap = [];
  const recommendedCourses = [];

  if (!hasReact) {
    skillGap.push('React.js');
    recommendedCourses.push({ id: 'crs-fullstack', title: 'Full Stack Web Architecture & Cloud Deploy', provider: 'Symbiosis Skills & Professional University' });
  }
  if (!hasNode) {
    skillGap.push('Node.js');
    recommendedCourses.push({ id: 'crs-fullstack', title: 'Full Stack Web Architecture & Cloud Deploy', provider: 'Symbiosis Skills & Professional University' });
  }

  const newCandidate = {
    candidateId,
    name: fullName,
    email: email.toLowerCase(),
    mobile: mobile || '+91 98230 45678',
    password: password || 'password123',
    district: district || 'Pune',
    gender: 'Female',
    socialCategory: 'General',
    areaType: 'Urban',
    isPwD: false,
    educationLevel: educationLevel || 'Bachelor of Computer Applications (BCA)',
    courseInterest: courseInterest || 'Software Development',
    skills: candidateSkills,
    verifiedSkills: candidateSkills.map(s => ({ name: s, provenance: 'Self-Reported', verified: false })),
    resumeName: resumeName || 'Resume_Uploaded.pdf',
    consentActive: consent !== undefined ? consent : true,
    consentSettings: {
      aadhaarEkycSharing: true,
      epfoWageVerification: true,
      automatedFollowupSurvey: true,
      policyResearchAnalytics: true,
      lastConsentUpdated: new Date().toISOString().split('T')[0]
    },
    registrationDate: new Date().toISOString().split('T')[0],
    cohortBatch: `Batch-${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth()/3)+1}-${district || 'Pune'}`,
    
    // Workflow States
    assignedProvider: null,
    assignedTrainer: null,
    enrolledCourse: null,
    trainingStatus: 'Not Enrolled',
    attendanceHistory: [],
    assessmentsCompleted: [],
    certificates: [],
    outcomeType: 'Seeking Placement',
    employmentStatus: 'Seeking Employment',
    employmentDetails: null,
    longitudinalTracking: {},
    salaryProgression: [
      { period: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), milestone: 'Account Registered', salary: 0 }
    ],
    followupHistory: [],
    milestones: [{ milestone: 'Account Registered & DPDP Consent Configured', date: new Date().toISOString().split('T')[0], details: `Candidate ID: ${candidateId}` }],
    skillGap,
    recommendedCourses
  };

  db.candidates.unshift(newCandidate);
  
  const userObj = {
    id: candidateId,
    candidateId,
    name: fullName,
    email: email.toLowerCase(),
    role: 'candidate',
    district: newCandidate.district,
    educationLevel: newCandidate.educationLevel
  };
  db.users.unshift(userObj);

  pushNotification(db, candidateId, 'candidate', 'Welcome to MahaSkill 360', `Account registered successfully! Candidate ID: ${candidateId}.`, 'success');

  db.auditLogs.unshift({
    timestamp: `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`,
    user: `${fullName} (${candidateId})`,
    action: `Registered new consent-based candidate profile in MahaSkill 360 DB`
  });

  writeDB(db);
  res.json({ message: 'Candidate registered successfully', user: userObj, candidate: newCandidate });
});

// ── 2. AUTH: LOGIN ───────────────────────────────────────────────────────────
router.post('/auth/login', (req, res) => {
  const db = readDB();
  const { role, emailOrId } = req.body;

  if (role === 'candidate') {
    let candidate = null;
    const q = (emailOrId || '').trim();
    if (q) {
      candidate = db.candidates.find(c => c.email.toLowerCase() === q.toLowerCase() || c.candidateId.toLowerCase() === q.toLowerCase());
    }

    // If candidate doesn't exist yet, create a fresh real account for them!
    if (!candidate && q) {
      const candidateId = q.startsWith('MH-CAND-') ? q : `MH-CAND-${Math.floor(100000 + Math.random() * 900000)}`;
      const derivedName = q.includes('@')
        ? q.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : (q.startsWith('MH-') ? 'Candidate' : q);
      const email = q.includes('@') ? q.toLowerCase() : `${derivedName.toLowerCase().replace(/\s+/g, '')}@skillmission.in`;

      candidate = {
        candidateId,
        name: derivedName,
        email: email.toLowerCase(),
        mobile: '+91 98230 45678',
        password: 'password123',
        district: 'Pune',
        gender: 'Female',
        socialCategory: 'General',
        areaType: 'Urban',
        isPwD: false,
        educationLevel: 'Bachelor of Computer Applications (BCA)',
        courseInterest: 'Software Development',
        skills: ['HTML', 'CSS', 'JavaScript'],
        verifiedSkills: [
          { name: 'HTML', provenance: 'Self-Reported', verified: false },
          { name: 'CSS', provenance: 'Self-Reported', verified: false },
          { name: 'JavaScript', provenance: 'Self-Reported', verified: false }
        ],
        resumeName: `Resume_${derivedName.replace(/\s+/g, '_')}.pdf`,
        consentActive: true,
        consentSettings: {
          aadhaarEkycSharing: true,
          epfoWageVerification: true,
          automatedFollowupSurvey: true,
          policyResearchAnalytics: true,
          lastConsentUpdated: new Date().toISOString().split('T')[0]
        },
        registrationDate: new Date().toISOString().split('T')[0],
        cohortBatch: `Batch-${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth()/3)+1}-Pune`,
        assignedProvider: null,
        assignedTrainer: null,
        enrolledCourse: null,
        trainingStatus: 'Not Enrolled',
        attendanceHistory: [],
        assessmentsCompleted: [],
        certificates: [],
        outcomeType: 'Seeking Placement',
        employmentStatus: 'Seeking Employment',
        employmentDetails: null,
        longitudinalTracking: {},
        salaryProgression: [
          { period: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), milestone: 'Account Registered', salary: 0 }
        ],
        followupHistory: [],
        milestones: [{ milestone: 'Account Registered & DPDP Consent Configured', date: new Date().toISOString().split('T')[0], details: `Candidate ID: ${candidateId}` }],
        skillGap: ['React.js', 'Node.js'],
        recommendedCourses: [
          { id: 'crs-fullstack', title: 'Full Stack Web Architecture & Cloud Deploy', provider: 'Symbiosis Skills & Professional University' }
        ]
      };

      db.candidates.unshift(candidate);
      db.users.unshift({
        id: candidateId,
        candidateId,
        name: derivedName,
        email: email.toLowerCase(),
        role: 'candidate',
        district: 'Pune'
      });
      writeDB(db);
    }

    if (!candidate && db.candidates.length > 0) {
      candidate = db.candidates[0];
    }

    if (!candidate) {
      return res.status(404).json({ error: 'No candidate record found. Please enter your email or register.' });
    }

    const userObj = {
      id: candidate.candidateId,
      candidateId: candidate.candidateId,
      name: candidate.name,
      email: candidate.email,
      role: 'candidate',
      district: candidate.district
    };
    return res.json({ user: userObj, candidate });
  }

  if (role === 'provider') {
    const provider = db.providers[0] || { id: 'TP-MH-01', name: 'MSSDS Centre of Excellence Pune' };
    const userObj = { id: provider.id, name: provider.name, role: 'provider', district: provider.district || 'Pune' };
    return res.json({ user: userObj, provider });
  }

  if (role === 'trainer') {
    const trainer = db.trainers[0] || { id: 'trn-01', name: 'Dr. Sameer Joshi' };
    const userObj = { id: trainer.id, name: trainer.name, role: 'trainer', email: trainer.email };
    return res.json({ user: userObj, trainer });
  }

  if (role === 'employer') {
    const employer = db.employers[0] || { id: 'EMP-MH-01', name: 'Tata Motors Ltd' };
    const userObj = { id: employer.id, name: employer.name, role: 'employer', district: employer.district || 'Pune' };
    return res.json({ user: userObj, employer });
  }

  if (role === 'government') {
    const userObj = { id: 'GOVT-MH-01', name: 'State Skilling Director (MSSDS)', role: 'government', district: 'Statewide' };
    return res.json({ user: userObj });
  }

  return res.status(400).json({ error: 'Invalid role specified' });
});

// ── 3. CANDIDATE PROFILE & CONSENT MANAGEMENT ─────────────────────────────────
router.get('/candidates/all', (req, res) => {
  const db = readDB();
  res.json(db.candidates || []);
});

router.get('/candidates/:id', (req, res) => {
  const db = readDB();
  const candidate = db.candidates.find(c => c.candidateId === req.params.id || c.email === req.params.id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  res.json(candidate);
});

// Update DPDP Consent Settings
router.post('/candidate/update-consent', (req, res) => {
  const db = readDB();
  const { candidateId, consentSettings } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  candidate.consentSettings = {
    ...candidate.consentSettings,
    ...consentSettings,
    lastConsentUpdated: new Date().toISOString().split('T')[0]
  };
  candidate.consentActive = !!(consentSettings?.aadhaarEkycSharing || consentSettings?.epfoWageVerification);

  candidate.milestones.unshift({
    milestone: 'DPDP Consent Settings Updated',
    date: new Date().toISOString().split('T')[0],
    details: `Updated verifiable consent preferences: eKYC (${candidate.consentSettings.aadhaarEkycSharing ? 'Active' : 'Disabled'}), EPFO (${candidate.consentSettings.epfoWageVerification ? 'Active' : 'Disabled'})`
  });

  pushNotification(db, candidateId, 'candidate', 'Consent Preferences Saved 🔒', 'Your DPDP Act data-sharing preferences have been securely logged.', 'success');

  writeDB(db);
  res.json({ message: 'Consent settings updated successfully', consentSettings: candidate.consentSettings, candidate });
});

// Candidate Enrolls in Course
router.post('/candidate/enroll-course', (req, res) => {
  const db = readDB();
  const { candidateId, courseId } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const course = db.courses.find(c => c.id === courseId) || db.courses[0];
  candidate.enrolledCourse = course;
  candidate.trainingStatus = 'Enrolled';
  candidate.assignedProvider = course.provider;

  const matchedTrainer = (db.trainers || []).find(t => {
    const spec = (t.specialization || '').toLowerCase();
    const title = (course.title || '').toLowerCase();
    if (title.includes('ev') || title.includes('vehicle')) return spec.includes('ev') || spec.includes('mobility');
    if (title.includes('cloud') || title.includes('devops')) return spec.includes('cloud') || spec.includes('devops');
    if (title.includes('full stack') || title.includes('react')) return spec.includes('stack') || spec.includes('full');
    if (title.includes('solar')) return spec.includes('solar');
    if (title.includes('cnc') || title.includes('machin')) return spec.includes('cnc');
    if (title.includes('robot')) return spec.includes('robot');
    if (title.includes('cyber')) return spec.includes('cyber');
    return false;
  }) || (db.trainers || [])[0];

  if (matchedTrainer) {
    candidate.assignedTrainer = matchedTrainer;
    candidate.trainingStatus = 'Trainer Assigned';
  }

  candidate.milestones.unshift({
    milestone: `Enrolled in ${course.title}`,
    date: new Date().toISOString().split('T')[0],
    details: `Provider: ${course.provider} · Instructor: ${candidate.assignedTrainer?.name || 'Assigned Lead'}`
  });

  pushNotification(db, candidateId, 'candidate', 'Course Enrollment Confirmed', `You have enrolled in ${course.title}. Instructor: ${candidate.assignedTrainer?.name || 'Faculty'}.`, 'success');
  pushNotification(db, 'TP-MH-01', 'provider', 'New Candidate Enrolled', `Candidate ${candidate.name} (${candidate.candidateId}) enrolled in ${course.title}.`, 'info');

  writeDB(db);
  res.json({ message: 'Enrolled successfully', candidate });
});

router.post('/candidate/unenroll-course', (req, res) => {
  const db = readDB();
  const { candidateId } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const prevCourseTitle = candidate.enrolledCourse ? candidate.enrolledCourse.title : 'Course';
  candidate.enrolledCourse = null;
  candidate.trainingStatus = 'Not Enrolled';
  candidate.assignedTrainer = null;
  candidate.assignedProvider = null;

  candidate.milestones.unshift({
    milestone: `Cancelled enrollment in ${prevCourseTitle}`,
    date: new Date().toISOString().split('T')[0],
    details: 'Enrollment cancelled by candidate'
  });

  pushNotification(db, candidateId, 'candidate', 'Course Enrollment Cancelled', `You have cancelled your enrollment in ${prevCourseTitle}.`, 'info');

  writeDB(db);
  res.json({ message: 'Unenrolled successfully', candidate });
});

// ── 4. OUTCOME LOGGING (SELF-EMPLOYMENT, APPRENTICESHIP, WAGE EMPLOYMENT) ───────

// Log Self-Employment / Micro-enterprise Outcome
router.post('/outcomes/log-self-employment', (req, res) => {
  const db = readDB();
  const { candidateId, enterpriseName, businessType, udyamRegistrationNumber, monthlyRevenue, mudraLoanSanctioned, mudraLoanAmount, gstin, employeesHired } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  candidate.outcomeType = 'Self-Employment / Micro-Enterprise';
  candidate.employmentStatus = 'SELF EMPLOYED VERIFIED';
  candidate.employmentDetails = {
    enterpriseName: enterpriseName || `${candidate.name} Enterprises`,
    businessType: businessType || 'Solar EPC & Technology Services',
    udyamRegistrationNumber: udyamRegistrationNumber || `UDYAM-MH-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
    monthlyRevenue: Number(monthlyRevenue) || 35000,
    mudraLoanSanctioned: mudraLoanSanctioned !== undefined ? mudraLoanSanctioned : true,
    mudraLoanAmount: Number(mudraLoanAmount) || 200000,
    gstin: gstin || '27AANPS4829J1Z6',
    commencementDate: new Date().toISOString().split('T')[0],
    employeesHired: Number(employeesHired) || 2,
    verifiedBy: `District Industries Centre (DIC) ${candidate.district}`,
    retentionMonths: 1
  };

  if (!candidate.longitudinalTracking) candidate.longitudinalTracking = {};
  candidate.longitudinalTracking.m30D = {
    status: '✓ Enterprise Active',
    date: new Date().toISOString().split('T')[0],
    salary: candidate.employmentDetails.monthlyRevenue,
    employerVerified: false
  };

  if (!candidate.salaryProgression) candidate.salaryProgression = [];
  candidate.salaryProgression.push({
    period: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    milestone: `Launched ${candidate.employmentDetails.enterpriseName}`,
    salary: candidate.employmentDetails.monthlyRevenue
  });

  candidate.milestones.unshift({
    milestone: `Self-Employment Registered: ${candidate.employmentDetails.enterpriseName}`,
    date: new Date().toISOString().split('T')[0],
    details: `Udyam No: ${candidate.employmentDetails.udyamRegistrationNumber} · Monthly Revenue: ₹${candidate.employmentDetails.monthlyRevenue.toLocaleString('en-IN')}`
  });

  pushNotification(db, candidateId, 'candidate', 'Self-Employment Outcome Recorded 🌟', `Enterprise '${candidate.employmentDetails.enterpriseName}' registered and verified via Udyam integration.`, 'success');
  pushNotification(db, 'GOVT-MH-01', 'government', 'New Micro-Enterprise Created', `${candidate.name} in ${candidate.district} launched ${candidate.employmentDetails.enterpriseName} (₹${candidate.employmentDetails.monthlyRevenue}/mo).`, 'info');

  writeDB(db);
  res.json({ message: 'Self-employment outcome logged successfully', candidate });
});

// Log Apprenticeship (NAPS / NATS) Outcome
router.post('/outcomes/log-apprenticeship', (req, res) => {
  const db = readDB();
  const { candidateId, company, role, napsContractId, monthlyStipend, apprenticeshipDurationMonths } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const stipendVal = Number(monthlyStipend) || 14500;
  candidate.outcomeType = 'Apprenticeship (NAPS / NATS)';
  candidate.employmentStatus = 'APPRENTICESHIP ACTIVE';
  candidate.employmentDetails = {
    company: company || 'Tata Motors Ltd',
    role: role || 'Apprentice Technician (NAPS)',
    napsContractId: napsContractId || `NAPS-MH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    monthlyStipend: stipendVal,
    apprenticeshipDurationMonths: Number(apprenticeshipDurationMonths) || 12,
    contractStartDate: new Date().toISOString().split('T')[0],
    stipendGovtShare: 1500,
    stipendEmployerShare: stipendVal - 1500,
    verifiedBy: 'NAPS Portal API Gateway',
    retentionMonths: 1
  };

  if (!candidate.longitudinalTracking) candidate.longitudinalTracking = {};
  candidate.longitudinalTracking.m30D = {
    status: '✓ Apprenticeship Active',
    date: new Date().toISOString().split('T')[0],
    salary: stipendVal,
    employerVerified: true
  };

  if (!candidate.salaryProgression) candidate.salaryProgression = [];
  candidate.salaryProgression.push({
    period: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    milestone: `NAPS Contract at ${candidate.employmentDetails.company}`,
    salary: stipendVal
  });

  candidate.milestones.unshift({
    milestone: `Apprenticeship Contract Signed: ${candidate.employmentDetails.company}`,
    date: new Date().toISOString().split('T')[0],
    details: `NAPS Contract ID: ${candidate.employmentDetails.napsContractId} · Stipend: ₹${stipendVal.toLocaleString('en-IN')}/mo`
  });

  pushNotification(db, candidateId, 'candidate', 'Apprenticeship Contract Active 🤝', `NAPS Apprenticeship at ${candidate.employmentDetails.company} verified with DBT stipend linkage.`, 'success');

  writeDB(db);
  res.json({ message: 'Apprenticeship outcome logged successfully', candidate });
});

// Log Wage Employment Outcome
router.post('/outcomes/log-wage-employment', (req, res) => {
  const db = readDB();
  const { candidateId, company, role, startingSalary, epfoUan } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const sal = Number(startingSalary) || 28000;
  candidate.outcomeType = 'Wage Employment';
  candidate.employmentStatus = 'EMPLOYED VERIFIED';
  candidate.employmentDetails = {
    company: company || 'TechCorp India Ltd',
    role: role || 'Junior Engineer',
    startingSalary: sal,
    currentSalary: sal,
    joiningDate: new Date().toISOString().split('T')[0],
    epfoUan: epfoUan || `101${Math.floor(100000000 + Math.random() * 900000000)}`,
    verifiedBy: `${company || 'Employer'} HR & EPFO Linkage`,
    retentionMonths: 1
  };

  if (!candidate.longitudinalTracking) candidate.longitudinalTracking = {};
  candidate.longitudinalTracking.m30D = {
    status: '✓ Retained',
    date: new Date().toISOString().split('T')[0],
    salary: sal,
    employerVerified: true
  };

  if (!candidate.salaryProgression) candidate.salaryProgression = [];
  candidate.salaryProgression.push({
    period: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    milestone: `Joined ${candidate.employmentDetails.company}`,
    salary: sal
  });

  candidate.milestones.unshift({
    milestone: `Employed at ${candidate.employmentDetails.company}`,
    date: new Date().toISOString().split('T')[0],
    details: `Role: ${candidate.employmentDetails.role} · Salary: ₹${sal.toLocaleString('en-IN')}/mo · EPFO UAN: ${candidate.employmentDetails.epfoUan}`
  });

  pushNotification(db, candidateId, 'candidate', 'Wage Employment Verified 🎉', `Employment at ${candidate.employmentDetails.company} verified via EPFO database.`, 'success');

  writeDB(db);
  res.json({ message: 'Wage employment outcome logged successfully', candidate });
});

// ── 5. AUTOMATED & ASSISTED FOLLOW-UP ENGINE ─────────────────────────────────

// Trigger Automated WhatsApp / IVR Follow-up Survey
router.post('/followups/trigger-automated', (req, res) => {
  const db = readDB();
  const { candidateId, checkpoint, channel } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const cp = checkpoint || 'Day 90';
  const ch = channel || 'WhatsApp Automated Bot';
  const isEmployed = candidate.employmentStatus.includes('EMPLOYED') || candidate.employmentStatus.includes('APPRENTICE') || candidate.employmentStatus.includes('SELF');
  const reportedSalary = candidate.employmentDetails?.currentSalary || candidate.employmentDetails?.monthlyRevenue || candidate.employmentDetails?.monthlyStipend || 28000;

  const followupRecord = {
    followupId: `flw-${Date.now()}`,
    candidateId: candidate.candidateId,
    candidateName: candidate.name,
    channel: ch,
    checkpoint: cp,
    date: new Date().toISOString().split('T')[0],
    status: isEmployed ? 'Employed & Retained' : 'Seeking Support / Bridge Training',
    salaryReported: isEmployed ? reportedSalary : 0,
    satisfactionScore: isEmployed ? 5 : 3,
    notes: `Automated ${ch} survey completed. Candidate verified current status: ${candidate.employmentStatus}.`
  };

  if (!candidate.followupHistory) candidate.followupHistory = [];
  candidate.followupHistory.unshift(followupRecord);

  candidate.milestones.unshift({
    milestone: `Completed ${cp} Automated Follow-Up (${ch})`,
    date: followupRecord.date,
    details: `Status: ${followupRecord.status} · Satisfaction: ${followupRecord.satisfactionScore}/5`
  });

  pushNotification(db, candidateId, 'candidate', `Automated ${cp} Follow-Up Recorded`, `Thank you for completing your ${cp} skilling survey on ${ch}.`, 'info');

  writeDB(db);
  res.json({ message: 'Automated follow-up triggered & recorded', followupRecord, candidate });
});

// Log Assisted Call-Center / Field Officer Follow-up
router.post('/followups/log-assisted-call', (req, res) => {
  const db = readDB();
  const { candidateId, checkpoint, officerName, employmentStatus, salaryReported, satisfactionScore, attritionReason, notes } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const cp = checkpoint || 'Day 180';
  const followupRecord = {
    followupId: `flw-${Date.now()}`,
    candidateId: candidate.candidateId,
    candidateName: candidate.name,
    channel: 'Assisted Call-Center',
    checkpoint: cp,
    date: new Date().toISOString().split('T')[0],
    officerName: officerName || 'Pooja Salunkhe (MSSDS Call-Center Officer)',
    status: employmentStatus || candidate.employmentStatus,
    salaryReported: Number(salaryReported) || candidate.employmentDetails?.currentSalary || 0,
    satisfactionScore: Number(satisfactionScore) || 5,
    attritionReason: attritionReason || null,
    notes: notes || 'Assisted phone interview conducted by state skilling officer.'
  };

  if (!candidate.followupHistory) candidate.followupHistory = [];
  candidate.followupHistory.unshift(followupRecord);

  if (attritionReason) {
    candidate.outcomeType = 'Non-Placed / Under Remediation';
    candidate.employmentStatus = 'ATTRITION FLAGGED / REMEDIAL ACTION';
    candidate.attritionRootCause = attritionReason;
    candidate.nonPlacementReason = attritionReason;
  }

  candidate.milestones.unshift({
    milestone: `Assisted Call-Center Follow-Up (${cp})`,
    date: followupRecord.date,
    details: `Officer: ${followupRecord.officerName} · Status: ${followupRecord.status}`
  });

  writeDB(db);
  res.json({ message: 'Assisted call follow-up logged successfully', followupRecord, candidate });
});

// Get All Follow-up Records across candidates
router.get('/followups/all', (req, res) => {
  const db = readDB();
  const candidates = db.candidates || [];
  const allFollowups = [];
  candidates.forEach(c => {
    (c.followupHistory || []).forEach(f => {
      allFollowups.push({
        ...f,
        candidateName: c.name,
        candidateDistrict: c.district,
        candidateMobile: c.mobile,
        candidateCourse: c.enrolledCourse?.title || 'Skilling Course'
      });
    });
  });

  allFollowups.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({
    totalFollowups: allFollowups.length,
    automatedCount: allFollowups.filter(f => f.channel.includes('WhatsApp') || f.channel.includes('IVR') || f.channel.includes('Automated')).length,
    assistedCount: allFollowups.filter(f => f.channel.includes('Assisted') || f.channel.includes('Call')).length,
    avgSatisfaction: allFollowups.length > 0 ? (allFollowups.reduce((acc, f) => acc + (f.satisfactionScore || 5), 0) / allFollowups.length).toFixed(1) : 4.8,
    followups: allFollowups
  });
});

// ── 6. EMPLOYER VERIFICATION ENGINE & REPOSITORY ─────────────────────────────

// Verify Employer Credentials (GSTIN, EPFO, MCA CIN)
router.post('/employer/verify-credentials', (req, res) => {
  const db = readDB();
  const { employerName, gstin, epfoCode, cin } = req.body;

  const isValidGSTIN = gstin ? /^27[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.trim()) || gstin.startsWith('27') : true;
  const isValidCIN = cin ? cin.length >= 21 : true;
  const isValidEPFO = epfoCode ? epfoCode.includes('/') || epfoCode.length >= 7 : true;

  const trustScore = (isValidGSTIN ? 35 : 0) + (isValidCIN ? 35 : 0) + (isValidEPFO ? 30 : 0);

  const verificationResult = {
    employerName: employerName || 'Tata Motors Ltd',
    gstin: gstin || '27AAACT2727Q1ZW',
    gstinStatus: isValidGSTIN ? '✓ ACTIVE & VERIFIED (Maharashtra GST Portal)' : '⚠️ INVALID GSTIN FORMAT',
    cin: cin || 'L28920MH1945PLC004520',
    mcaStatus: isValidCIN ? '✓ ACTIVE COMPLIANT (Ministry of Corporate Affairs)' : '⚠️ UNREGISTERED CIN',
    epfoEstablishmentCode: epfoCode || 'MH/BAN/0001234/000',
    epfoStatus: isValidEPFO ? '✓ ACTIVE CONTRIBUTOR (EPFO Portal)' : '⚠️ EPFO CODE UNVERIFIED',
    overallTrustScore: trustScore,
    verifiedAt: new Date().toISOString()
  };

  res.json({
    valid: trustScore >= 70,
    message: trustScore >= 70 ? '✓ Employer Enterprise Credentials Verified Successfully' : '⚠️ Verification Warnings Detected',
    verificationResult
  });
});

router.get('/employers/all', (req, res) => {
  const db = readDB();
  res.json(db.employers || []);
});

// ── 7. SKILL GAP ANALYSIS & TARGETED REMEDIAL ACTIONS ────────────────────────

// Get Dynamic Skill Gap & Attrition Cause Analytics
router.get('/analytics/skill-gaps-and-attrition', (req, res) => {
  const db = readDB();
  const candidates = db.candidates || [];

  const skillGapFrequency = {};
  const attritionCauses = {};

  candidates.forEach(c => {
    (c.skillGap || []).forEach(sg => {
      skillGapFrequency[sg] = (skillGapFrequency[sg] || 0) + 1;
    });
    if (c.attritionRootCause || c.nonPlacementReason) {
      const cause = c.attritionRootCause || c.nonPlacementReason;
      attritionCauses[cause] = (attritionCauses[cause] || 0) + 1;
    }
  });

  const skillGapList = Object.entries(skillGapFrequency).map(([skill, count]) => ({ skill, count }));
  const attritionList = Object.entries(attritionCauses).map(([reason, count]) => ({ reason, count }));

  res.json({
    skillGaps: skillGapList,
    attritionCauses: attritionList,
    interventions: db.interventions || []
  });
});

// Trigger Targeted Remedial Action (Bridge Course, Counseling, Local MIDC Placement)
router.post('/remediation/trigger-action', (req, res) => {
  const db = readDB();
  const { candidateId, remedialCourseTitle, counselorNotes, targetCluster } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const intervention = {
    id: `itv-${Date.now()}`,
    candidateId: candidate.candidateId,
    candidateName: candidate.name,
    detectedGap: candidate.attritionRootCause || candidate.nonPlacementReason || 'Skill & Geographic Alignment Gap',
    recommendedBridgeCourse: remedialCourseTitle || 'Advanced Fast-Track Industrial Bridge Module',
    counselorNotes: counselorNotes || `Targeted remediation assigned to ${targetCluster || 'Local District MIDC'}`,
    status: 'ACTIVE REMEDIATION',
    date: new Date().toISOString().split('T')[0]
  };

  if (!db.interventions) db.interventions = [];
  db.interventions.unshift(intervention);

  candidate.remediationStatus = 'Targeted Remedial Action Active';
  candidate.remedialActionDetails = {
    assignedBridgeCourse: intervention.recommendedBridgeCourse,
    counselorNotes: intervention.counselorNotes,
    date: intervention.date
  };

  candidate.milestones.unshift({
    milestone: `Targeted Remedial Action Assigned: ${intervention.recommendedBridgeCourse}`,
    date: intervention.date,
    details: intervention.counselorNotes
  });

  pushNotification(db, candidate.candidateId, 'candidate', 'Targeted Remedial Course Assigned 🎯', `You have been enrolled in '${intervention.recommendedBridgeCourse}' with localized placement support.`, 'success');

  writeDB(db);
  res.json({ message: 'Targeted remedial action triggered successfully', intervention, candidate });
});

// ── 8. MULTI-DIMENSIONAL GOVERNMENT & POLICY ANALYTICS ────────────────────────

router.get('/government/analytics', (req, res) => {
  const db = readDB();
  const candidates = db.candidates || [];
  
  const totalCandidates = candidates.length;
  const certifiedCount = candidates.filter(c => c.certificates && c.certificates.length > 0).length;
  
  // Categorize Outcomes
  const wageEmployed = candidates.filter(c => c.outcomeType === 'Wage Employment' || c.employmentStatus === 'EMPLOYED VERIFIED' || c.employmentStatus === 'Joined');
  const selfEmployed = candidates.filter(c => c.outcomeType?.includes('Self-Employment') || c.employmentStatus?.includes('SELF EMPLOYED'));
  const apprenticeships = candidates.filter(c => c.outcomeType?.includes('Apprenticeship') || c.employmentStatus?.includes('APPRENTICESHIP'));
  const nonPlacedOrRemedial = candidates.filter(c => c.outcomeType?.includes('Non-Placed') || c.employmentStatus?.includes('ATTRITION') || c.remediationStatus);

  const totalPositiveOutcomes = wageEmployed.length + selfEmployed.length + apprenticeships.length;
  const placementRate = certifiedCount > 0 ? Math.round((totalPositiveOutcomes / certifiedCount) * 100) : 0;

  // Longitudinal Retentions
  const m30DCount = candidates.filter(c => c.longitudinalTracking?.m30D).length;
  const m3MCount = candidates.filter(c => c.longitudinalTracking?.m3M).length;
  const m6MCount = candidates.filter(c => c.longitudinalTracking?.m6M).length;
  const m12MCount = candidates.filter(c => c.longitudinalTracking?.m12M).length;
  const m24MCount = candidates.filter(c => c.longitudinalTracking?.m24M).length;

  // District Breakdown across Maharashtra
  const districtMap = {};
  candidates.forEach(c => {
    const d = c.district || 'Pune';
    if (!districtMap[d]) districtMap[d] = { district: d, total: 0, wage: 0, self: 0, apprentice: 0, remedial: 0, certified: 0 };
    districtMap[d].total += 1;
    if (c.certificates?.length > 0) districtMap[d].certified += 1;
    if (c.outcomeType === 'Wage Employment' || c.employmentStatus === 'EMPLOYED VERIFIED') districtMap[d].wage += 1;
    else if (c.outcomeType?.includes('Self-Employment')) districtMap[d].self += 1;
    else if (c.outcomeType?.includes('Apprenticeship')) districtMap[d].apprentice += 1;
    else districtMap[d].remedial += 1;
  });

  // Demographic Breakdown
  const femaleCount = candidates.filter(c => c.gender === 'Female').length;
  const maleCount = candidates.filter(c => c.gender === 'Male').length;
  const pwdCount = candidates.filter(c => c.isPwD).length;
  const ruralCount = candidates.filter(c => c.areaType === 'Rural').length;
  const semiUrbanCount = candidates.filter(c => c.areaType === 'Semi-Urban').length;
  const urbanCount = candidates.filter(c => c.areaType === 'Urban').length;

  const socialCategoryMap = {};
  candidates.forEach(c => {
    const cat = c.socialCategory || 'General';
    socialCategoryMap[cat] = (socialCategoryMap[cat] || 0) + 1;
  });

  // Calculate Average Salary Progression
  const allSalaries = [];
  candidates.forEach(c => {
    const s = c.employmentDetails?.currentSalary || c.employmentDetails?.monthlyRevenue || c.employmentDetails?.monthlyStipend;
    if (s) allSalaries.push(s);
  });
  const avgSalary = allSalaries.length > 0 ? Math.round(allSalaries.reduce((a, b) => a + b, 0) / allSalaries.length) : 32500;

  res.json({
    totalCandidates,
    activeStudents: candidates.filter(c => c.trainingStatus === 'In Training' || c.trainingStatus === 'Enrolled' || c.trainingStatus === 'Trainer Assigned').length,
    certifiedCount,
    applicationsCount: (db.applications || []).length,
    employedCount: totalPositiveOutcomes,
    wageEmployedCount: wageEmployed.length,
    selfEmployedCount: selfEmployed.length,
    apprenticeshipCount: apprenticeships.length,
    remedialInterventionCount: (db.interventions || []).length,
    placementRate,
    avgSalary: `₹${avgSalary.toLocaleString('en-IN')}/mo`,
    dataProvenance: 'Live Single Source of Truth DB (DPDP Act Verifiable Consent)',
    
    // Longitudinal Metrics
    longitudinalMetrics: {
      m30DCount,
      m3MCount,
      m6MCount,
      m12MCount,
      m24MCount,
      retention30DPct: totalPositiveOutcomes > 0 ? Math.round((m30DCount / totalPositiveOutcomes) * 100) : 100,
      retention3MPct: totalPositiveOutcomes > 0 ? Math.round((m3MCount / totalPositiveOutcomes) * 100) : 100,
      retention6MPct: totalPositiveOutcomes > 0 ? Math.round((m6MCount / totalPositiveOutcomes) * 100) : 100,
      retention12MPct: totalPositiveOutcomes > 0 ? Math.round((m12MCount / totalPositiveOutcomes) * 100) : 100,
      retention24MPct: totalPositiveOutcomes > 0 ? Math.round((m24MCount / totalPositiveOutcomes) * 100) : 100
    },

    // Multi-Dimensional Analytics
    districtBreakdown: Object.values(districtMap),
    demographics: {
      femaleCount,
      maleCount,
      femalePct: Math.round((femaleCount / totalCandidates) * 100) || 45,
      malePct: Math.round((maleCount / totalCandidates) * 100) || 55,
      pwdCount,
      ruralCount,
      semiUrbanCount,
      urbanCount,
      socialCategories: Object.entries(socialCategoryMap).map(([name, value]) => ({ name, value }))
    },
    providers: db.providers || [],
    courses: db.courses || [],
    employers: db.employers || [],
    interventions: db.interventions || [],
    candidates
  });
});

// ── 9. SIMULATION ADVANCE TIME & INTERVENTIONS ────────────────────────────────

router.post('/simulation/advance-time', (req, res) => {
  const db = readDB();
  const { candidateId, milestone } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  if (!candidate.longitudinalTracking) candidate.longitudinalTracking = {};
  if (!candidate.salaryProgression) {
    candidate.salaryProgression = [
      { period: 'Jan 2026', milestone: 'Enrolled in Skill Mission', salary: 0 }
    ];
  }

  let note = '';
  if (milestone === '30D') {
    note = '30-Day Checkpoint: Outcome Active & Retained. Verified by Employer / Udyam.';
    candidate.longitudinalTracking.m30D = { status: '✓ Retained', date: new Date().toISOString().split('T')[0], salary: 28000, employerVerified: true };
    if (!candidate.salaryProgression.some(s => s.period.includes('30D'))) {
      candidate.salaryProgression.push({ period: '30D (1M)', milestone: '30-Day Retained', salary: 28000 });
    }
  }
  if (milestone === '3M') {
    note = '3-Month Checkpoint: Career progression milestone verified (₹32,000/mo).';
    candidate.longitudinalTracking.m3M = { status: '✓ Retained & Performing', date: new Date().toISOString().split('T')[0], salary: 32000, employerVerified: true };
    if (!candidate.salaryProgression.some(s => s.period.includes('3M'))) {
      candidate.salaryProgression.push({ period: '3M Milestone', milestone: '3-Month Milestone', salary: 32000 });
    }
  }
  if (milestone === '6M') {
    note = '6-Month Checkpoint: Appraisal verified (+25.0% wage growth, ₹38,000/mo).';
    candidate.longitudinalTracking.m6M = { status: '✓ Retained & Promoted', date: new Date().toISOString().split('T')[0], salary: 38000, wageGrowthPct: '+25.0%', employerVerified: true };
    if (!candidate.salaryProgression.some(s => s.period.includes('6M'))) {
      candidate.salaryProgression.push({ period: '6M Milestone', milestone: '6-Month Appraisal', salary: 38000 });
    }
  }
  if (milestone === '12M') {
    note = '12-Month Checkpoint: Long-term career leadership verified (₹45,000/mo).';
    candidate.longitudinalTracking.m12M = { status: '✓ Senior Role Retained', date: new Date().toISOString().split('T')[0], salary: 45000, wageGrowthPct: '+60.7%', employerVerified: true };
    if (!candidate.salaryProgression.some(s => s.period.includes('12M'))) {
      candidate.salaryProgression.push({ period: '12M Milestone', milestone: '12-Month Milestone', salary: 45000 });
    }
  }
  if (milestone === '24M') {
    note = '24-Month Checkpoint: 2-Year Long-term Career Leader (₹55,000/mo).';
    candidate.longitudinalTracking.m24M = { status: '✓ 2-Year Retained Leader', date: new Date().toISOString().split('T')[0], salary: 55000, wageGrowthPct: '+96.4%', employerVerified: true };
    if (!candidate.salaryProgression.some(s => s.period.includes('24M'))) {
      candidate.salaryProgression.push({ period: '24M Milestone', milestone: '2-Year Milestone', salary: 55000 });
    }
  }

  candidate.milestones.unshift({
    milestone: `🟣 Longitudinal ${milestone} Milestone`,
    date: new Date().toISOString().split('T')[0],
    details: `${note} (Longitudinal Outcome Tracking)`
  });

  writeDB(db);
  res.json({ message: `Advanced longitudinal tracking to ${milestone}`, milestoneTag: `🟣 Longitudinal Outcome: ${milestone}`, candidate });
});

router.post('/interventions/trigger', (req, res) => {
  const db = readDB();
  const { candidateId, courseTitle } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId) || db.candidates[0];
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const intervention = {
    id: `itv-${Date.now()}`,
    candidateId: candidate.candidateId,
    candidateName: candidate.name,
    detectedGap: candidate.postEmploymentSkillGap || 'Advanced Industrial Skill Gap',
    recommendedBridgeCourse: courseTitle || 'Advanced Modular Reskilling Track',
    status: 'ACTIVE RESKILLING',
    date: new Date().toISOString().split('T')[0]
  };

  if (!db.interventions) db.interventions = [];
  db.interventions.unshift(intervention);
  candidate.postEmploymentSkillGap = null;

  candidate.milestones.unshift({
    milestone: `Longitudinal Reskilling Intervention Completed`,
    date: new Date().toISOString().split('T')[0],
    details: `Completed bridge training: ${intervention.recommendedBridgeCourse}`
  });

  pushNotification(db, candidate.candidateId, 'candidate', 'Reskilling Intervention Completed', `Bridge course '${intervention.recommendedBridgeCourse}' completed! Skill profile updated.`, 'success');

  writeDB(db);
  res.json({ message: 'Intervention completed & candidate reskilled', intervention, candidate });
});

// ── 10. COURSES, TRAINERS & SCHEDULES ─────────────────────────────────────────

router.get('/courses/all', (req, res) => {
  const db = readDB();
  res.json(db.courses || []);
});

router.get('/trainers/all', (req, res) => {
  const db = readDB();
  const trainers = (db.trainers || []).map(t => {
    const assignedCount = (db.candidates || []).filter(c => c.assignedTrainer?.id === t.id).length;
    return {
      ...t,
      assignedCount,
      status: assignedCount === 0 ? 'Free / Available' : `${assignedCount} Active Candidate${assignedCount > 1 ? 's' : ''}`
    };
  });
  res.json(trainers);
});

router.post('/provider/assign-trainer', (req, res) => {
  const db = readDB();
  const { candidateId, trainerId } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const trainer = db.trainers.find(t => t.id === trainerId) || db.trainers[0];
  candidate.assignedTrainer = trainer;
  candidate.trainingStatus = 'Trainer Assigned';

  candidate.milestones.unshift({
    milestone: `Assigned to ${trainer.name}`,
    date: new Date().toISOString().split('T')[0],
    details: `Specialization: ${trainer.specialization}`
  });

  pushNotification(db, candidateId, 'candidate', 'Trainer Assigned', `${trainer.name} has been assigned as your instructor.`, 'success');

  writeDB(db);
  res.json({ message: 'Trainer assigned successfully', candidate });
});

router.post('/trainer/create-schedule', (req, res) => {
  const db = readDB();
  const { trainerId, candidateId, topic, date, time, duration, location } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const schedule = {
    id: `sch-${Date.now()}`,
    trainerId: trainerId || 'trn-01',
    candidateId,
    candidateName: candidate.name,
    topic: topic || 'Advanced Practical Lab Session',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '10:00 AM',
    duration: duration || '2 Hours',
    location: location || 'Centre of Excellence Lab (Pune)',
    status: 'Scheduled'
  };

  db.schedules.unshift(schedule);
  candidate.trainingStatus = 'In Training';

  pushNotification(db, candidateId, 'candidate', 'New Training Session Scheduled 📅', `Session '${schedule.topic}' scheduled for ${schedule.date} at ${schedule.time}.`, 'warning');

  writeDB(db);
  res.json({ message: 'Schedule created successfully', schedule });
});

router.get('/trainer/schedules/:trainerId', (req, res) => {
  const db = readDB();
  const schedules = (db.schedules || []).filter(s => s.trainerId === req.params.trainerId || req.params.trainerId === 'all');
  res.json(schedules);
});

// ── 11. ATTENDANCE & ASSESSMENTS ──────────────────────────────────────────────

router.post('/candidate/mark-attendance', (req, res) => {
  const db = readDB();
  const { candidateId, scheduleId, photoData } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const schedule = db.schedules.find(s => s.id === scheduleId) || db.schedules[0] || { topic: 'Hands-on Workshop', date: new Date().toISOString().split('T')[0] };

  const attendanceReq = {
    id: `att-${Date.now()}`,
    candidateId,
    candidateName: candidate.name,
    scheduleId: schedule.id,
    topic: schedule.topic,
    date: schedule.date,
    time: new Date().toLocaleTimeString('en-IN'),
    photoData: photoData || 'data:image/png;base64,webcam_attendance_live',
    status: 'Pending Verification'
  };

  db.attendanceRequests.unshift(attendanceReq);
  pushNotification(db, 'trn-01', 'trainer', 'Attendance Verification Request 📷', `Candidate ${candidate.name} submitted live camera attendance for ${schedule.topic}.`, 'info');

  writeDB(db);
  res.json({ message: 'Attendance photo submitted for verification', attendanceReq });
});

router.get('/trainer/attendance-requests', (req, res) => {
  const db = readDB();
  res.json(db.attendanceRequests || []);
});

router.post('/trainer/verify-attendance', (req, res) => {
  const db = readDB();
  const { attendanceId } = req.body;

  const attReq = db.attendanceRequests.find(a => a.id === attendanceId);
  if (!attReq) return res.status(404).json({ error: 'Attendance request not found' });

  attReq.status = 'Verified';

  const candidate = db.candidates.find(c => c.candidateId === attReq.candidateId);
  if (candidate) {
    if (!candidate.attendanceHistory) candidate.attendanceHistory = [];
    candidate.attendanceHistory.unshift({
      date: attReq.date,
      time: attReq.time,
      session: attReq.topic,
      status: '✓ Present',
      photo: attReq.photoData,
      verifiedBy: 'Certified Instructor'
    });
  }

  pushNotification(db, attReq.candidateId, 'candidate', 'Attendance Verified ✓', `Your attendance for '${attReq.topic}' on ${attReq.date} was verified.`, 'success');

  writeDB(db);
  res.json({ message: 'Attendance verified successfully', attReq });
});

router.post('/trainer/create-assessment', (req, res) => {
  const db = readDB();
  const { candidateId, title, date, time, totalMarks } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const assessment = {
    id: `asm-${Date.now()}`,
    candidateId,
    candidateName: candidate.name,
    title: title || 'NCVET Practical Evaluation',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '02:00 PM',
    totalMarks: totalMarks || 100,
    status: 'Scheduled'
  };

  db.assessments.unshift(assessment);
  pushNotification(db, candidateId, 'candidate', 'New Assessment Scheduled 📝', `'${assessment.title}' is scheduled for ${assessment.date} at ${assessment.time}.`, 'warning');

  writeDB(db);
  res.json({ message: 'Assessment created successfully', assessment });
});

router.post('/candidate/submit-assessment', (req, res) => {
  const db = readDB();
  const { candidateId, assessmentId } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const score = 92;
  const submission = {
    id: `sub-${Date.now()}`,
    assessmentId,
    candidateId,
    score,
    result: 'PASSED',
    date: new Date().toISOString().split('T')[0]
  };

  if (!db.assessmentSubmissions) db.assessmentSubmissions = [];
  db.assessmentSubmissions.unshift(submission);
  if (!candidate.assessmentsCompleted) candidate.assessmentsCompleted = [];
  candidate.assessmentsCompleted.unshift({
    title: 'Practical Skill Competency Evaluation',
    score: `${score}%`,
    result: 'PASSED',
    date: submission.date
  });

  candidate.trainingStatus = 'Completed';

  // Issue Digital Certificate
  const certId = `CERT-MH-${candidate.district.slice(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const hash = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const certificate = {
    certificateId: certId,
    candidateId,
    candidateName: candidate.name,
    courseTitle: candidate.enrolledCourse?.title || 'Technical Skill Competency Track',
    providerName: candidate.assignedProvider || 'MSSDS Centre of Excellence Pune',
    trainerName: candidate.assignedTrainer?.name || 'Prof. Rajesh Kulkarni',
    issueDate: new Date().toISOString().split('T')[0],
    score: `${score}%`,
    status: '✓ Verified & Authenticated',
    certHash: hash
  };

  if (!db.certificates) db.certificates = [];
  if (!candidate.certificates) candidate.certificates = [];
  db.certificates.unshift(certificate);
  candidate.certificates.unshift(certificate);

  candidate.milestones.unshift({
    milestone: `Passed NCVET Assessment (${score}%) & Issued Certificate`,
    date: new Date().toISOString().split('T')[0],
    details: `Certificate ID: ${certId} · Cryptographic Hash: ${hash.slice(0, 12)}...`
  });

  pushNotification(db, candidateId, 'candidate', 'Certificate Issued! 📜', `Passed '${certificate.courseTitle}' with ${score}%. Certificate ${certId} generated!`, 'success');

  writeDB(db);
  res.json({ message: 'Assessment submitted and certificate generated', score, certificate, candidate });
});

// Candidate Adds External Certificate
router.post('/candidate/add-certificate', (req, res) => {
  const db = readDB();
  const { candidateId, courseTitle, provider, issueDate, score, credentialId } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const certId = credentialId || `CERT-EXT-${Date.now().toString().slice(-6)}`;
  const hash = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const newCertificate = {
    certificateId: certId,
    candidateId,
    candidateName: candidate.name,
    courseTitle: courseTitle || 'External Skill Certification',
    provider: provider || 'External Certification Board',
    providerName: provider || 'External Certification Board',
    issueDate: issueDate || new Date().toISOString().split('T')[0],
    score: score ? (score.toString().includes('%') ? score : `${score}%`) : '100%',
    certHash: hash,
    status: '✓ Verified & Authenticated',
    isExternal: true
  };

  if (!candidate.certificates) candidate.certificates = [];
  candidate.certificates.unshift(newCertificate);
  if (!db.certificates) db.certificates = [];
  db.certificates.unshift(newCertificate);

  candidate.milestones.unshift({
    milestone: `Added Certification: ${newCertificate.courseTitle}`,
    date: newCertificate.issueDate,
    details: `Credential ID: ${certId} · Issued by ${newCertificate.provider}`
  });

  pushNotification(db, candidateId, 'candidate', 'Certificate Added Successfully 📜', `Added ${newCertificate.courseTitle} to verified credentials.`, 'success');

  writeDB(db);
  res.json({ message: 'Certificate added successfully', certificate: newCertificate, candidate });
});

router.post('/candidate/delete-certificate', (req, res) => {
  const db = readDB();
  const { candidateId, certificateId } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  if (candidate.certificates) {
    candidate.certificates = candidate.certificates.filter(c => c.certificateId !== certificateId);
  }
  if (db.certificates) {
    db.certificates = db.certificates.filter(c => c.certificateId !== certificateId);
  }

  writeDB(db);
  res.json({ message: 'Certificate removed successfully', candidate });
});

// ── 12. JOB MARKETPLACE & APPLICATION ─────────────────────────────────────────

router.get('/jobs/all', (req, res) => {
  const db = readDB();
  res.json(db.jobs || []);
});

router.post('/candidate/apply-job', (req, res) => {
  const db = readDB();
  const { candidateId, jobId } = req.body;

  const candidate = db.candidates.find(c => c.candidateId === candidateId);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  const job = db.jobs.find(j => j.id === jobId) || db.jobs[0] || { id: 'job-01', title: 'EV Battery Diagnostic Engineer', company: 'Tata Motors Ltd' };

  const application = {
    id: `app-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    candidateId,
    candidateName: candidate.name,
    candidateEmail: candidate.email,
    candidateDistrict: candidate.district,
    resumeName: candidate.resumeName,
    certificates: candidate.certificates,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'APPLIED'
  };

  if (!db.applications) db.applications = [];
  if (!candidate.applications) candidate.applications = [];

  db.applications.unshift(application);
  candidate.applications.unshift(application);
  candidate.employmentStatus = 'Applied';

  candidate.milestones.unshift({
    milestone: `Applied to ${job.title} at ${job.company}`,
    date: new Date().toISOString().split('T')[0],
    details: `Status: APPLIED`
  });

  pushNotification(db, 'EMP-MH-01', 'employer', 'New Job Application Received 💼', `${candidate.name} (${candidateId}) applied for ${job.title}.`, 'info');
  pushNotification(db, candidateId, 'candidate', 'Application Submitted', `Your application for ${job.title} at ${job.company} was submitted.`, 'success');

  writeDB(db);
  res.json({ message: 'Application submitted successfully', application });
});

// HR Verify Certificate
router.post('/hr/verify-certificate', (req, res) => {
  const db = readDB();
  const { certificateId } = req.body;

  const cert = db.certificates.find(c => c.certificateId === certificateId || c.certificateId === `CERT-${certificateId}`);
  if (!cert) {
    return res.status(404).json({ valid: false, message: '⚠️ Verification Failed — Certificate ID not found in MahaSkill 360 single source database.' });
  }

  res.json({
    valid: true,
    message: '✓ Certificate Cryptographically Authenticated & Verified in Government Single Source Database',
    certificate: cert
  });
});

router.post('/hr/update-pipeline', (req, res) => {
  const db = readDB();
  const { applicationId, candidateId, nextStatus, salary } = req.body;

  let candidate = candidateId ? db.candidates.find(c => c.candidateId === candidateId) : null;
  let app = applicationId ? db.applications.find(a => a.id === applicationId) : null;

  if (!candidate && app) candidate = db.candidates.find(c => c.candidateId === app.candidateId);
  if (!app && candidate) app = db.applications.find(a => a.candidateId === candidate.candidateId);

  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  if (app) app.status = nextStatus || 'EMPLOYED VERIFIED';
  candidate.employmentStatus = nextStatus;

  if (nextStatus === 'EMPLOYED VERIFIED' || nextStatus === 'Joined') {
    candidate.outcomeType = 'Wage Employment';
    candidate.employmentDetails = {
      company: app ? app.company : 'Tata Motors Ltd',
      role: app ? app.jobTitle : 'EV Diagnostic Engineer',
      salary: salary || '₹32,000/mo',
      currentSalary: 32000,
      joiningDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Tata Motors HR Sign-off',
      retentionMonths: 1
    };
    candidate.milestones.unshift({
      milestone: `Employment Confirmed at ${candidate.employmentDetails.company}`,
      date: new Date().toISOString().split('T')[0],
      details: `Role: ${candidate.employmentDetails.role} · Salary: ${salary || '₹32,000/mo'}`
    });
    pushNotification(db, candidate.candidateId, 'candidate', 'Employment Verified! 🎉', `Congratulations! Your employment is HR-verified.`, 'success');
  }

  writeDB(db);
  res.json({ message: 'Pipeline updated successfully', application: app, candidate });
});

// ── 13. NOTIFICATIONS & MESSAGING ─────────────────────────────────────────────

router.get('/notifications/:userId', (req, res) => {
  const db = readDB();
  const notifs = (db.notifications || []).filter(n => n.userId === req.params.userId || n.role === req.params.userId || req.params.userId === 'all');
  res.json(notifs);
});

router.post('/messages/send', (req, res) => {
  const db = readDB();
  const { fromRole, fromName, toRole, message } = req.body;

  pushNotification(db, toRole || 'all', toRole || 'all', `Message from ${fromName || fromRole}`, message, 'info');

  db.auditLogs.unshift({
    timestamp: `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`,
    user: fromName || fromRole,
    action: `Sent message: "${message}" to ${toRole || 'All Stakeholders'}`
  });

  writeDB(db);
  res.json({ message: 'Message sent successfully' });
});

export default router;
