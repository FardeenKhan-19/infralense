import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Clock, MapPin, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../ui/GlassCard';

const CommunityFeed: React.FC = () => {
  const [petitions, setPetitions] = useState<any[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/petitions/community', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPetitions(res.data);
      } catch {}
    };
    fetch();
  }, []);

  const handleVote = (id: string) => {
    setVotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-10">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
          <Globe className="text-[var(--accent)]" size={28} /> Community Feed
        </h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">See what citizens across the nation are reporting</p>
      </header>

      <div className="space-y-6 max-w-3xl">
        {petitions.length === 0 ? (
          <div className="h-[40vh] flex items-center justify-center text-[10px] uppercase tracking-[0.4em] font-black text-white/10">No community posts yet</div>
        ) : petitions.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="!p-6 border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-black font-black text-xs">
                    C{(i % 9) + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/40 uppercase">Anonymous Citizen</span>
                    <div className="flex items-center gap-2 text-[9px] text-white/20">
                      <Clock size={10} /> {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                  p.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                  p.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>{p.status}</span>
              </div>

              <h3 className="font-black text-lg mb-2 group-hover:text-[var(--accent)] transition-colors">{p.title}</h3>
              
              <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
                <MapPin size={12} /> {p.locationName}
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-3 italic">"{p.content}"</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-4 text-[10px] text-white/20 uppercase font-bold">
                  <span>Severity: <span className={p.severityScore > 70 ? 'text-red-400' : 'text-[var(--accent)]'}>{p.severityScore}%</span></span>
                  <span>Impact: <span className="text-white/40">{p.population?.toLocaleString()}</span></span>
                </div>
                <button onClick={() => handleVote(p.id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/20 transition-all text-white/40 hover:text-[var(--accent)]"
                >
                  <ThumbsUp size={12} /> {votes[p.id] || 0}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
