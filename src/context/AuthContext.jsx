import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchGovernmentAnalytics, loginUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mahaskill_user');
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return null;
  });

  const [dbStats, setDbStats] = useState({ totalCandidates: 0, activeStudents: 0, certifiedCount: 0, employedCount: 0 });

  const loadStats = async () => {
    const data = await fetchGovernmentAnalytics();
    if (data) {
      setDbStats({
        totalCandidates: data.totalCandidates || 0,
        activeStudents: data.activeStudents || 0,
        certifiedCount: data.certifiedCount || 0,
        employedCount: data.employedCount || 0
      });
    }
  };

  useEffect(() => {
    loadStats();
  }, [currentUser]);

  const loginAsUser = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('mahaskill_user', JSON.stringify(userObj));
    loadStats();
  };

  const loginAsDemoRole = async (role) => {
    try {
      const res = await loginUser(role, role === 'candidate' ? (currentUser?.email || 'candidate@skillmission.in') : '');
      if (res.user) {
        loginAsUser(res.user);
        return res.user;
      }
    } catch (e) {
      console.error('Demo role login error:', e);
    }
    
    // Fallback Institutional roles
    let userObj;
    switch (role) {
      case 'provider':
        userObj = { id: 'TP-MH-01', name: 'MSSDS Centre of Excellence Pune', role: 'provider', district: 'Pune' };
        break;
      case 'trainer':
        userObj = { id: 'trn-01', name: 'Dr. Sameer Joshi', role: 'trainer', email: 'sameer.joshi@sspu.ac.in' };
        break;
      case 'employer':
        userObj = { id: 'EMP-MH-01', name: 'Tata Motors Ltd', role: 'employer', district: 'Pune' };
        break;
      case 'government':
        userObj = { id: 'GOVT-MH-01', name: 'State Skilling Director (MSSDS)', role: 'government', district: 'Statewide' };
        break;
      default:
        userObj = { id: 'MH-CAND-NEW', candidateId: 'MH-CAND-NEW', name: 'Candidate User', role: 'candidate', email: 'candidate@skillmission.in', district: 'Pune' };
    }
    if (userObj) {
      loginAsUser(userObj);
    }
    return userObj;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mahaskill_user');
    loadStats();
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginAsUser, loginAsDemoRole, logout, dbStats, refreshStats: loadStats }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
