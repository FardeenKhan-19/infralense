import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { ArrowLeft, Megaphone, Send, AlertTriangle, Info, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('INFO');

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data);
    } catch { }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Fill all fields');
    try {
      const token = localStorage.getItem('token');
      await axios.post(import.meta.env.VITE_API_URL + '/api/announcements',
        { title, content, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Broadcast dispatched');
      setTitle(''); setContent(''); setPriority('INFO');
      fetchAnnouncements();
    } catch {
      toast.error('Failed to dispatch');
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'CRITICAL': return 'border-red-500/30 bg-red-500/5 text-red-400';
      case 'WARNING': return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
      default: return 'border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent)]';
    }
  };
  const getPriorityIcon = (p: string) => {
    switch (p) {
      case 'CRITICAL': return <AlertTriangle size={14} />;
      case 'WARNING': return <Zap size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020812] text-white p-8">
      <header className="flex items-center gap-6 mb-10">
        <Link to="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[var(--accent)] transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Broadcast Center</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">System-Wide Citizen Announcements</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compose */}
        <GlassCard className="!p-8 border-white/5">
          <h3 className="font-black italic tracking-tighter uppercase text-lg flex items-center gap-3 mb-8">
            <Megaphone className="text-[var(--accent)]" size={18} /> Compose Broadcast
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[9px] uppercase font-black tracking-[0.3em] text-white/30 mb-2 block">Subject</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium focus:border-[var(--accent)] outline-none transition-all"
                placeholder="Infrastructure Update: New Policy..."
              />
            </div>
            <div>
              <label className="text-[9px] uppercase font-black tracking-[0.3em] text-white/30 mb-2 block">Message</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium focus:border-[var(--accent)] outline-none transition-all resize-none"
                placeholder="Compose your broadcast message..."
              />
            </div>
            <div>
              <label className="text-[9px] uppercase font-black tracking-[0.3em] text-white/30 mb-2 block">Priority</label>
              <div className="flex gap-3">
                {['INFO', 'WARNING', 'CRITICAL'].map(p => (
                  <button key={p} type="button" onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${priority === p ? getPriorityStyle(p) : 'border-white/5 bg-white/[0.02] text-white/30'
                      }`}
                  >{p}</button>
                ))}
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-[var(--accent)] text-black font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,245,255,0.3)] transition-all">
              <Send size={16} /> Dispatch Broadcast
            </button>
          </form>
        </GlassCard>

        {/* History */}
        <GlassCard className="!p-8 border-white/5 flex flex-col">
          <h3 className="font-black italic tracking-tighter uppercase text-lg mb-6">Broadcast History</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
            {announcements.length === 0 ? (
              <div className="h-40 flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/15">No broadcasts yet</p>
              </div>
            ) : announcements.map((a: any) => (
              <div key={a.id} className={`p-5 rounded-2xl border ${getPriorityStyle(a.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(a.priority)}
                    <span className="text-[9px] font-black uppercase tracking-widest">{a.priority}</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/20">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <h4 className="font-black text-sm mb-1">{a.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed italic">{a.content}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminAnnouncements;
