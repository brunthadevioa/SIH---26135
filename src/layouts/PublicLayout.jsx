import React from 'react';
import Navbar from '../components/Navbar';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase">SKILL MISSION</span>
            <span>• Government Skilling Platform</span>
          </div>
          <p>From Training to Verified Career Impact</p>
        </div>
      </footer>
    </div>
  );
}
