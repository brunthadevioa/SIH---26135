import React, { useState, useEffect } from "react";
import SidebarLayout from "../../layouts/SidebarLayout";
import { CANDIDATE_NAV } from "../../config/sidebarNav";
import { fetchNotifications, sendMessage } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Mail, Bell, CheckCircle2 } from "lucide-react";

export default function CandidateMessagesPage() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState("trainer");
  const [toast, setToast] = useState("");

  const candidateId = currentUser?.candidateId || "MH-CAND-782194";

  useEffect(() => {
    fetchNotifications(candidateId).then(n => setNotifications(n || []));
  }, [candidateId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const msgObj = {
      id: Date.now(),
      text: newMessage,
      to: recipient === 'trainer' ? 'Assigned Trainer' : recipient === 'provider' ? 'Training Provider' : recipient === 'employer' ? 'HR / Employer' : 'Government Officer',
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };
    setSentMessages(prev => [msgObj, ...prev]);
    await sendMessage('candidate', currentUser?.name || 'Candidate', recipient, newMessage);
    setToast("✉️ Message sent successfully!");
    setTimeout(() => setToast(""), 3000);
    setNewMessage("");
  };

  return (
    <SidebarLayout sidebarItems={CANDIDATE_NAV} roleName="Candidate Portal" roleColor="blue">
      <div className="space-y-6 animate-fadeInUp p-6">
        
        {toast && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-base font-black text-slate-900">Candidate Messages & Notifications</h1>
            <p className="text-xs text-slate-500">Communicate directly with Trainers, Providers, Employers, and Government Officers</p>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">{sentMessages.length + notifications.length} Total</span>
        </div>

        {/* Send Message */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" /> Send Message
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="trainer">To: Assigned Trainer</option>
              <option value="provider">To: Training Provider</option>
              <option value="employer">To: HR / Employer</option>
              <option value="government">To: Government Official</option>
            </select>

            <input
              type="text"
              placeholder="Type your query or message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
            
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-3 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition"
            >
              <Mail className="w-4 h-4" /> Send
            </button>
          </div>

          {sentMessages.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sent Messages</p>
              {sentMessages.map(m => (
                <div key={m.id} className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-blue-900">{m.text}</p>
                    <p className="text-[10px] text-slate-500">To: {m.to}</p>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold shrink-0">{m.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Received Notifications & Messages */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" /> Received System Notifications ({notifications.length})
          </h2>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-50 rounded-2xl">No notifications received yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((n, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{n.title}</p>
                    <p className="text-[10px] text-slate-500">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </SidebarLayout>
  );
}
