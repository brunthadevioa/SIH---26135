/**
 * Sidebar navigation configs for each role.
 * Import the relevant config in each dashboard page.
 */
import {
  User, Sparkles, BookOpen, Camera, Award, Briefcase, TrendingUp,
  LayoutDashboard, Users, Calendar, ClipboardList, ShieldCheck,
  Building2, Search, Database, BarChart3, MessageSquare, UserCheck,
  GraduationCap, FileText, PhoneCall, PieChart, Activity
} from 'lucide-react';

export const CANDIDATE_NAV = {
  role: 'Candidate Portal',
  name: 'Candidate Portal',
  sections: [
    {
      label: 'My Dashboard',
      items: [
        { path: '/candidate/skills',       label: 'Skills, Gaps & Consent',  icon: Sparkles },
        { path: '/candidate/provenance',   label: 'Skill Provenance Ledger', icon: ShieldCheck },
        { path: '/candidate/training',     label: 'Courses & Enrollment',    icon: BookOpen },
        { path: '/candidate/attendance',   label: 'Camera Attendance',       icon: Camera },
        { path: '/candidate/certificates', label: 'Certificates & Results',  icon: Award },
        { path: '/candidate/jobs',         label: 'Job Marketplace',         icon: Briefcase },
        { path: '/candidate/longitudinal', label: 'Longitudinal Tracking',   icon: TrendingUp },
        { path: '/candidate/messages',     label: 'Messages',                icon: MessageSquare },
      ]
    }
  ]
};

export const TRAINER_NAV = {
  role: 'Trainer Portal',
  name: 'Dr. Sameer Joshi (Lead Faculty)',
  sections: [
    {
      label: 'Trainer Modules',
      items: [
        { path: '/trainer/dashboard',    label: 'Overview',                icon: LayoutDashboard },
        { path: '/trainer/candidates',   label: 'My Candidates',           icon: Users },
        { path: '/trainer/schedule',     label: 'Create Schedule',         icon: Calendar },
        { path: '/trainer/assessment',   label: 'Assessments',             icon: ClipboardList },
        { path: '/trainer/attendance',   label: 'Camera Verification',     icon: Camera },
        { path: '/trainer/messages',     label: 'Messages',                icon: MessageSquare },
      ]
    }
  ]
};

export const PROVIDER_NAV = {
  role: 'Training Provider',
  name: 'MSSDS Centre of Excellence Pune',
  sections: [
    {
      label: 'Provider Modules',
      items: [
        { path: '/provider/dashboard',   label: 'Overview & SLA Score',    icon: LayoutDashboard },
        { path: '/provider/candidates',  label: 'Candidate Cohort',        icon: Users },
        { path: '/provider/trainers',    label: 'Certified Faculty (6)',   icon: GraduationCap },
        { path: '/provider/assign',      label: 'Trainer Assignment',      icon: UserCheck },
        { path: '/provider/messages',    label: 'Messages',                icon: MessageSquare },
      ]
    }
  ]
};

export const EMPLOYER_NAV = {
  role: 'Employer / HR Portal',
  name: 'Tata Motors Ltd (EV Division)',
  sections: [
    {
      label: 'HR Modules',
      items: [
        { path: '/employer/dashboard',   label: 'Overview',                icon: LayoutDashboard },
        { path: '/employer/verify',      label: 'Verify Credentials & Certs', icon: ShieldCheck },
        { path: '/employer/pipeline',    label: 'HR Pipeline & Offers',    icon: Building2 },
        { path: '/employer/messages',    label: 'Messages',                icon: MessageSquare },
      ]
    }
  ]
};

export const GOVERNMENT_NAV = {
  role: 'Government Portal',
  name: 'State Skilling Directorate (MSSDS)',
  sections: [
    {
      label: 'Policy & Analytics',
      items: [
        { path: '/government/dashboard',     label: 'Impact Overview',         icon: BarChart3 },
        { path: '/government/analytics',     label: 'Cohort & District Analytics', icon: PieChart },
        { path: '/government/longitudinal',  label: 'Longitudinal Metrics',    icon: TrendingUp },
        { path: '/government/followups',     label: 'Follow-Up Engine (IVR/Call)', icon: PhoneCall },
        { path: '/government/candidates',    label: 'Candidate Registry',      icon: Database },
        { path: '/government/messages',      label: 'Messages',                icon: MessageSquare },
      ]
    }
  ]
};
