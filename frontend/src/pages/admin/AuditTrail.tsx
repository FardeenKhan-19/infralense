import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { ArrowLeft, Shield, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AuditTrail: React.FC = () => {
  const [petitions, setPetitions] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/petitions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPetitions(res.data);
      } catch {}
    };
    fetch();
  }, []);

  const actionLog = petitions
    .filter(p => filter === 'ALL' || p.status === filter)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const getIcon = (status: string) => {
    switch(status) {
      case 'APPROVED': return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'REJECTED': return <XCircle size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020812] text-white p-8">
      <header className="flex items-center gap-6 mb-10">
        <Link to="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[var(--accent)] transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Audit Trail</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Full System Accountability Ledger</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-white/30" />
          {['ALL', 'APPROVED', 'REJECTED', 'PENDING'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${
                filter === f ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-white/5 text-white/30'
              }`}
            >{f}</button>
          ))}
        </div>
      </header>

      <GlassCard className="!p-8 border-white/5">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/5" />
          
          <div className="space-y-0">
            {actionLog.length === 0 ? (
              <div className="py-20 text-center text-[10px] uppercase tracking-[0.4em] font-black text-white/10">No records found</div>
            ) : actionLog.map((item, i) => (
              <div key={item.id} className="flex gap-6 group relative py-5">
                <div className="relative z-10 w-10 h-10 rounded-xl bg-[#020812] border border-white/10 flex items-center justify-center group-hover:border-[var(--accent)] transition-all shrink-0">
                  {getIcon(item.status)}
                </div>
                <div className="flex-1 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>{item.status}</span>
                    <span className="text-[9px] text-white/20 font-mono">{new Date(item.updatedAt).toLocaleString()}</span>
                  </div>
                  <h4 className="font-black text-sm italic mb-1">{item.locationName}</h4>
                  <div className="flex items-center gap-4 text-[10px] text-white/30">
                    <span>By: {item.creator?.name || 'Unknown'}</span>
                    <span>Severity: {item.severityScore}%</span>
                    <span>ID: {item.id.slice(-8)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AuditTrail;
