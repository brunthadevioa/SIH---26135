import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/public/LandingPage';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';

import Candidate360 from './pages/candidate/Candidate360';
import CandidateSkillsPage from './pages/candidate/CandidateSkillsPage';
import CandidateProvenancePage from './pages/candidate/CandidateProvenancePage';
import CandidateTrainingPage from './pages/candidate/CandidateTrainingPage';
import CandidateAttendancePage from './pages/candidate/CandidateAttendancePage';
import CandidateCertificatesPage from './pages/candidate/CandidateCertificatesPage';
import CandidateJobsPage from './pages/candidate/CandidateJobsPage';
import CandidateLongitudinalPage from './pages/candidate/CandidateLongitudinalPage';
import CandidateMessagesPage from './pages/candidate/CandidateMessagesPage';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderCandidatesPage from './pages/provider/ProviderCandidatesPage';
import ProviderTrainersPage from './pages/provider/ProviderTrainersPage';
import ProviderAssignPage from './pages/provider/ProviderAssignPage';
import ProviderMessagesPage from './pages/provider/ProviderMessagesPage';

import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerCandidatesPage from './pages/trainer/TrainerCandidatesPage';
import TrainerSchedulePage from './pages/trainer/TrainerSchedulePage';
import TrainerAssessmentPage from './pages/trainer/TrainerAssessmentPage';
import TrainerAttendancePage from './pages/trainer/TrainerAttendancePage';
import TrainerMessagesPage from './pages/trainer/TrainerMessagesPage';

import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerVerifyPage from './pages/employer/EmployerVerifyPage';
import EmployerPipelinePage from './pages/employer/EmployerPipelinePage';
import EmployerMessagesPage from './pages/employer/EmployerMessagesPage';

import GovernmentDashboard from './pages/government/GovernmentDashboard';
import GovernmentCandidatesPage from './pages/government/GovernmentCandidatesPage';
import GovernmentAnalyticsPage from './pages/government/GovernmentAnalyticsPage';
import GovernmentLongitudinalPage from './pages/government/GovernmentLongitudinalPage';
import GovernmentFollowupsPage from './pages/government/GovernmentFollowupsPage';
import GovernmentMessagesPage from './pages/government/GovernmentMessagesPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />

      {/* Candidate Sub-Pages */}
      <Route path="/candidate/360" element={<Navigate to="/candidate/skills" replace />} />
      <Route path="/candidate" element={<Navigate to="/candidate/skills" replace />} />
      <Route path="/candidate/skills" element={<DashboardLayout><CandidateSkillsPage /></DashboardLayout>} />
      <Route path="/candidate/provenance" element={<DashboardLayout><CandidateProvenancePage /></DashboardLayout>} />
      <Route path="/candidate/training" element={<DashboardLayout><CandidateTrainingPage /></DashboardLayout>} />
      <Route path="/candidate/attendance" element={<DashboardLayout><CandidateAttendancePage /></DashboardLayout>} />
      <Route path="/candidate/certificates" element={<DashboardLayout><CandidateCertificatesPage /></DashboardLayout>} />
      <Route path="/candidate/jobs" element={<DashboardLayout><CandidateJobsPage /></DashboardLayout>} />
      <Route path="/candidate/longitudinal" element={<DashboardLayout><CandidateLongitudinalPage /></DashboardLayout>} />
      <Route path="/candidate/messages" element={<DashboardLayout><CandidateMessagesPage /></DashboardLayout>} />

      {/* Provider Sub-Pages */}
      <Route path="/provider/dashboard" element={<DashboardLayout><ProviderDashboard /></DashboardLayout>} />
      <Route path="/provider/candidates" element={<DashboardLayout><ProviderCandidatesPage /></DashboardLayout>} />
      <Route path="/provider/trainers" element={<DashboardLayout><ProviderTrainersPage /></DashboardLayout>} />
      <Route path="/provider/assign" element={<DashboardLayout><ProviderAssignPage /></DashboardLayout>} />
      <Route path="/provider/messages" element={<DashboardLayout><ProviderMessagesPage /></DashboardLayout>} />

      {/* Trainer Sub-Pages */}
      <Route path="/trainer/dashboard" element={<DashboardLayout><TrainerDashboard /></DashboardLayout>} />
      <Route path="/trainer/candidates" element={<DashboardLayout><TrainerCandidatesPage /></DashboardLayout>} />
      <Route path="/trainer/schedule" element={<DashboardLayout><TrainerSchedulePage /></DashboardLayout>} />
      <Route path="/trainer/assessment" element={<DashboardLayout><TrainerAssessmentPage /></DashboardLayout>} />
      <Route path="/trainer/attendance" element={<DashboardLayout><TrainerAttendancePage /></DashboardLayout>} />
      <Route path="/trainer/messages" element={<DashboardLayout><TrainerMessagesPage /></DashboardLayout>} />

      {/* Employer Sub-Pages */}
      <Route path="/employer/dashboard" element={<DashboardLayout><EmployerDashboard /></DashboardLayout>} />
      <Route path="/employer/verify" element={<DashboardLayout><EmployerVerifyPage /></DashboardLayout>} />
      <Route path="/employer/pipeline" element={<DashboardLayout><EmployerPipelinePage /></DashboardLayout>} />
      <Route path="/employer/messages" element={<DashboardLayout><EmployerMessagesPage /></DashboardLayout>} />

      {/* Government Sub-Pages */}
      <Route path="/government/dashboard" element={<DashboardLayout><GovernmentDashboard /></DashboardLayout>} />
      <Route path="/government/analytics" element={<DashboardLayout><GovernmentAnalyticsPage /></DashboardLayout>} />
      <Route path="/government/candidates" element={<DashboardLayout><GovernmentCandidatesPage /></DashboardLayout>} />
      <Route path="/government/longitudinal" element={<DashboardLayout><GovernmentLongitudinalPage /></DashboardLayout>} />
      <Route path="/government/followups" element={<DashboardLayout><GovernmentFollowupsPage /></DashboardLayout>} />
      <Route path="/government/messages" element={<DashboardLayout><GovernmentMessagesPage /></DashboardLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
