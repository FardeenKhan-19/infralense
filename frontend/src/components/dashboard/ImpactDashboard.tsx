import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, MapPin, TrendingUp, Star, Shield, Award } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../ui/GlassCard';

const rankConfig: Record<string, { color: string, icon: React.ReactNode, bg: string }> = {
  'RECRUIT': { color: 'text-white/40', icon: <Star size={28} />, bg: 'from-gray-600 to-gray-800' },
  'FIELD OPERATIVE': { color: 'text-blue-400', icon: <Shield size={28} />, bg: 'from-blue-600 to-blue-800' },
  'SENIOR ANALYST': { color: 'text-purple-400', icon: <Award size={28} />, bg: 'from-purple-600 to-purple-800' },
  'ELITE ADVOCATE': { color: 'text-amber-400', icon: <Trophy size={28} />, bg: 'from-amber-500 to-amber-700' },
};

const ImpactDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/petitions/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch { }
    };
    fetch();
  }, []);

  if (!stats) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[var(--accent-dim)] border-t-[var(--accent)] rounded-full animate-spin" />
    </div>
  );

  const rc = rankConfig[stats.rank] || rankConfig['RECRUIT'];

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
      <header className="mb-10">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
          <Trophy className="text-amber-400" size={28} /> My Impact
        </h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Your contribution to national infrastructure reform</p>
      </header>

      {/* Rank Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8">
        <div className={`p-8 rounded-3xl bg-gradient-to-br ${rc.bg} border border-white/10 flex items-center gap-8 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="w-20 h-20 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center relative z-10">
            {rc.icon}
          </div>
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60">Current Rank</span>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase">{stats.rank}</h3>
            <p className="text-xs text-white/50 mt-1 italic">Submit more petitions to advance your rank</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Cases', value: stats.total, icon: <Target size={18} className="text-blue-400" /> },
          { label: 'Approved', value: stats.approved, icon: <TrendingUp size={18} className="text-emerald-400" /> },
          { label: 'Rejected', value: stats.rejected, icon: <Target size={18} className="text-red-400" /> },
          { label: 'Approval Rate', value: `${stats.approvalRate}%`, icon: <Star size={18} className="text-amber-400" /> },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="!p-6 border-white/5 text-center">
              <div className="flex justify-center mb-3">{s.icon}</div>
              <p className="text-3xl font-black italic mb-1">{s.value}</p>
              <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20">{s.label}</span>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Regions Covered */}
      <GlassCard className="!p-8 border-white/5">
        <h3 className="font-black italic tracking-tighter uppercase text-lg flex items-center gap-3 mb-6">
          <MapPin className="text-[var(--accent)]" size={18} /> Regions Covered
        </h3>
        <div className="flex flex-wrap gap-3">
          {stats.locations.length === 0 ? (
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/15">No regions yet — analyze a sector to begin</span>
          ) : stats.locations.map((loc: string, i: number) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white/50 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >{loc}</motion.span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default ImpactDashboard;
