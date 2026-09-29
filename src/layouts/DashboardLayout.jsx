import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

