const API_BASE = '/api';

export const registerCandidate = async (payload) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const loginUser = async (role, emailOrId) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, emailOrId })
  });
  return res.json();
};

export const fetchAllCandidates = async () => {
  try {
    const res = await fetch(`${API_BASE}/candidates/all`);
    return res.json();
  } catch (err) {
    console.error('Error fetching candidates:', err);
    return [];
  }
};

export const fetchCandidateById = async (id) => {
  if (!id) return null;
  try {
    const res = await fetch(`${API_BASE}/candidates/${id}`);
    return res.json();
  } catch (err) {
    console.error('Error fetching candidate:', err);
    return null;
  }
};

// Consent Management (DPDP Act)
export const updateCandidateConsent = async (candidateId, consentSettings) => {
  const res = await fetch(`${API_BASE}/candidate/update-consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, consentSettings })
  });
  return res.json();
};

export const enrollInCourse = async (candidateId, courseId) => {
  const res = await fetch(`${API_BASE}/candidate/enroll-course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, courseId })
  });
  return res.json();
};

export const unenrollCourse = async (candidateId) => {
  const res = await fetch(`${API_BASE}/candidate/unenroll-course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId })
  });
  return res.json();
};

export const addCandidateCertificate = async (payload) => {
  const res = await fetch(`${API_BASE}/candidate/add-certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const deleteCandidateCertificate = async (candidateId, certificateId) => {
  const res = await fetch(`${API_BASE}/candidate/delete-certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, certificateId })
  });
  return res.json();
};

// Outcome Logging (Self-Employment, Apprenticeship, Wage Employment)
export const logSelfEmployment = async (payload) => {
  const res = await fetch(`${API_BASE}/outcomes/log-self-employment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const logApprenticeship = async (payload) => {
  const res = await fetch(`${API_BASE}/outcomes/log-apprenticeship`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const logWageEmployment = async (payload) => {
  const res = await fetch(`${API_BASE}/outcomes/log-wage-employment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

// Follow-up Engine
export const triggerAutomatedFollowup = async (payload) => {
  const res = await fetch(`${API_BASE}/followups/trigger-automated`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const logAssistedCall = async (payload) => {
  const res = await fetch(`${API_BASE}/followups/log-assisted-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const fetchFollowups = async () => {
  try {
    const res = await fetch(`${API_BASE}/followups/all`);
    return res.json();
  } catch (err) {
    return { totalFollowups: 0, automatedCount: 0, assistedCount: 0, avgSatisfaction: 5, followups: [] };
  }
};

// Employer Engine
export const verifyEmployerCredentials = async (payload) => {
  const res = await fetch(`${API_BASE}/employer/verify-credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const fetchAllEmployers = async () => {
  try {
    const res = await fetch(`${API_BASE}/employers/all`);
    return res.json();
  } catch (err) {
    return [];
  }
};

// Skill Gaps, Attrition & Remedial Actions
export const fetchSkillGapsAndAttrition = async () => {
  try {
    const res = await fetch(`${API_BASE}/analytics/skill-gaps-and-attrition`);
    return res.json();
  } catch (err) {
    return { skillGaps: [], attritionCauses: [], interventions: [] };
  }
};

export const triggerRemedialAction = async (payload) => {
  const res = await fetch(`${API_BASE}/remediation/trigger-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const fetchTrainers = async () => {
  try {
    const res = await fetch(`${API_BASE}/trainers/all`);
    return res.json();
  } catch (err) {
    console.error('Error fetching trainers:', err);
    return [];
  }
};

export const fetchCourses = async () => {
  try {
    const res = await fetch(`${API_BASE}/courses/all`);
    return res.json();
  } catch (err) {
    console.error('Error fetching courses:', err);
    return [];
  }
};

export const assignTrainer = async (candidateId, trainerId) => {
  const res = await fetch(`${API_BASE}/provider/assign-trainer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, trainerId })
  });
  return res.json();
};

export const createSchedule = async (payload) => {
  const res = await fetch(`${API_BASE}/trainer/create-schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const fetchTrainerSchedules = async (trainerId = 'all') => {
  try {
    const res = await fetch(`${API_BASE}/trainer/schedules/${trainerId}`);
    return res.json();
  } catch (err) {
    return [];
  }
};

export const markAttendanceWithWebcam = async (payload) => {
  const res = await fetch(`${API_BASE}/candidate/mark-attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const fetchAttendanceRequests = async () => {
  try {
    const res = await fetch(`${API_BASE}/trainer/attendance-requests`);
    return res.json();
  } catch (err) {
    return [];
  }
};

export const verifyAttendance = async (attendanceId) => {
  const res = await fetch(`${API_BASE}/trainer/verify-attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attendanceId })
  });
  return res.json();
};

export const createAssessment = async (payload) => {
  const res = await fetch(`${API_BASE}/trainer/create-assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const submitAssessment = async (payload) => {
  const res = await fetch(`${API_BASE}/candidate/submit-assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const fetchJobs = async () => {
  try {
    const res = await fetch(`${API_BASE}/jobs/all`);
    return res.json();
  } catch (err) {
    return [];
  }
};

export const applyToJob = async (candidateId, jobId) => {
  const res = await fetch(`${API_BASE}/candidate/apply-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, jobId })
  });
  return res.json();
};

export const verifyCertificateHR = async (certificateId) => {
  const res = await fetch(`${API_BASE}/hr/verify-certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ certificateId })
  });
  return res.json();
};

export const updateHRPipeline = async (applicationId, nextStatus, salary, candidateId) => {
  const res = await fetch(`${API_BASE}/hr/update-pipeline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId, nextStatus, salary, candidateId })
  });
  return res.json();
};

export const advanceSimulationTime = async (candidateId, milestone) => {
  const res = await fetch(`${API_BASE}/simulation/advance-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, milestone })
  });
  return res.json();
};

export const triggerReskillingIntervention = async (candidateId, courseTitle) => {
  const res = await fetch(`${API_BASE}/interventions/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, courseTitle })
  });
  return res.json();
};

export const fetchGovernmentAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE}/government/analytics`);
    return res.json();
  } catch (err) {
    return { totalCandidates: 0, certifiedCount: 0, employedCount: 0, placementRatePct: 0 };
  }
};

export const fetchNotifications = async (userId) => {
  try {
    const res = await fetch(`${API_BASE}/notifications/${userId}`);
    return res.json();
  } catch (err) {
    return [];
  }
};

export const sendMessage = async (fromRole, fromName, toRole, message) => {
  const res = await fetch(`${API_BASE}/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromRole, fromName, toRole, message })
  });
  return res.json();
};
