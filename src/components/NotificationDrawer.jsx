import React, { useState, useEffect } from 'react';
import { fetchNotifications } from '../services/api';
import { Bell, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationDrawer({ userId, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function load() {
      if (!userId) return;
      const data = await fetchNotifications(userId);
      setNotifications(data || []);
    }
    load();
  }, [userId]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between space-y-4 animate-slideInRight border-l border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-900 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">System Messages & Feed</h2>
              <p className="text-[10px] text-slate-500">Real-time alerts & status notifications</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600">No New Notifications</p>
              <p className="text-[10px]">Updates about course enrollment, attendance verification, and job offers will appear here.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-4 rounded-2xl border text-xs space-y-1 ${
                n.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
                n.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-950' :
                'bg-blue-50 border-blue-200 text-blue-950'
              }`}>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-slate-900">{n.title}</h3>
                  <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{n.message}</p>
                <p className="text-[9px] font-bold text-slate-400 pt-1">{n.date}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl cursor-pointer shadow"
          >
            Close Messages Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
