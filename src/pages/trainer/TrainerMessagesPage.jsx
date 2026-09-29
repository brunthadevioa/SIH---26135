import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { TRAINER_NAV } from "../../config/sidebarNav";
import { fetchNotifications } from "../../services/api";
import { MessageSquare, Mail, Bell } from "lucide-react";

export default function TrainerMessagesPage() {
  const [notifications, setNotifications] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchNotifications("trainer").then(n => setNotifications(n || []));
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setSentMessages(prev => [{ id: Date.now(), text: newMessage, to: "All Assigned Candidates", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }, ...prev]);
    setNewMessage("");
  };

  return (
    <SidebarLayout sidebarItems={TRAINER_NAV} roleName="Trainer Portal" roleColor="purple">
      <div className="space-y-6 animate-fadeInUp p-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-base font-black text-slate-900">Messages</h1>
          <span className="text-xs font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">{sentMessages.length + notifications.length} Total</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-amber-600" /> Send Message to Candidates</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500" />
            <button onClick={handleSend} className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-5 py-3 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0"><Mail className="w-4 h-4" /> Send</button>
          </div>
          {sentMessages.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sent</p>
              {sentMessages.map(m => (
                <div key={m.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center text-xs">
                  <div><p className="font-bold text-amber-900">{m.text}</p><p className="text-[10px] text-slate-500">To: {m.to}</p></div>
                  <span className="text-[10px] text-amber-600 font-bold shrink-0">{m.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2"><Bell className="w-4 h-4 text-blue-600" /> Notifications ({notifications.length})</h2>
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                  <div><p className="font-bold text-slate-800">{n.title}</p><p className="text-[10px] text-slate-500">{n.message}</p></div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
