import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import {
  FileText,
  Map as MapIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  XCircle,
  ShieldCheck,
  FileSearch,
  Download,
  LogOut,
  Zap,
  Users,
  BarChart3,
  Globe,
  Server
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

const socket = io(import.meta.env.VITE_API_URL);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState("Analyzing recent geospatial trends...");
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [petitions, setPetitions] = useState<any[]>([]);
  const [selectedPetition, setSelectedPetition] = useState<any | null>(null);
  const [adminLog, setAdminLog] = useState<{ action: string, time: string }[]>([]);
  const [systemUptime] = useState(() => {
    const start = Date.now() - Math.floor(Math.random() * 86400000);
    return start;
  });
  const [uptimeStr, setUptimeStr] = useState('00:00:00');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Session terminated. Returning to base.');
    navigate('/');
  };

  const fetchPetitions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/petitions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPetitions(res.data);
    } catch (err) {
      toast.error('Failed to fetch global petitions');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/petitions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Petition ${status}`);
      setAdminLog(prev => [{ action: `${status} petition ${id.slice(-6)}`, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
      fetchPetitions();
      socket.emit('admin_action', { type: 'PETITION_STATUS_UPDATE', id, status });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchPetitions();
    socket.on('intelligence_update', (data) => {
      setLiveFeed(prev => [data, ...prev].slice(0, 8));
      if (data.type === 'recommendation') {
        setRecommendation(data.text);
      }
    });

    const uptimeInterval = setInterval(() => {
      const diff = Date.now() - systemUptime;
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setUptimeStr(`${h}:${m}:${s}`);
    }, 1000);

    return () => {
      socket.off('intelligence_update');
      clearInterval(uptimeInterval);
    };
  }, []);

  const pendingCount = petitions.filter(p => p.status === 'PENDING').length;
  const approvedCount = petitions.filter(p => p.status === 'APPROVED').length;
  const rejectedCount = petitions.filter(p => p.status === 'REJECTED').length;
  const criticalCount = petitions.filter(p => p.severityScore > 80).length;

  const stats = [
    { label: 'Total Petitions', value: petitions.length.toString(), icon: <FileText className="text-blue-400" />, trend: '+12%' },
    { label: 'Pending Action', value: pendingCount.toString(), icon: <Clock className="text-amber-400" />, trend: 'Live' },
    { label: 'Approved Reforms', value: approvedCount.toString(), icon: <ShieldCheck className="text-emerald-400" />, trend: '+8%' },
    { label: 'Critical Zones', value: criticalCount.toString(), icon: <AlertTriangle className="text-red-400" />, trend: 'Priority' },
  ];

  return (
    <div className="min-h-screen bg-[#020812] text-white p-8 font-sans selection:bg-[var(--accent)] selection:text-black">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="Infralense Logo"
              className="h-14 w-14 rounded-full aspect-square object-cover filter brightness-125 border-2 border-[var(--accent)]/20 shadow-[0_0_20px_rgba(0,245,255,0.2)]"
            />
          </Link>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Command Center</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">National Infrastructure Intelligence Oversight</p>
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Link to="/admin/analytics" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--accent)] transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={12} /> Analytics
          </Link>
          <Link to="/admin/citizens" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--accent)] transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <Users size={12} /> Citizens
          </Link>
          <Link to="/admin/audit" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--accent)] transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={12} /> Audit
          </Link>
          <Link to="/admin/announcements" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--accent)] transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <Globe size={12} /> Broadcast
          </Link>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <Link to="/dashboard" className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--accent)] transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <MapIcon size={12} /> Intel Map
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-black transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-red-400 hover:border-red-500"
          >
            <LogOut size={12} /> Logout
          </button>
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[var(--accent)] text-xs">
            AD
          </div>
        </div>
      </header>

      {/* System Health Bar */}
      <div className="mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-6 overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <Server size={14} className="text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">System Status</span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 text-[9px] font-black uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Zap size={14} className="text-amber-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Uptime</span>
          <span className="font-mono text-xs font-bold text-[var(--accent)]">{uptimeStr}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Globe size={14} className="text-blue-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Region</span>
          <span className="text-[10px] font-black text-white/60">INDIA — SOUTH ASIA</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Users size={14} className="text-purple-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Active Citizens</span>
          <span className="text-[10px] font-black text-white/60">{petitions.length > 0 ? new Set(petitions.map(p => p.creatorId)).size : 0}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="!p-6 border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-[var(--accent)]/10 group-hover:border-[var(--accent)]/20 transition-all">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-white/5 text-[var(--accent)] tracking-widest uppercase">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em] mb-2">{stat.label}</h3>
            <p className="text-4xl font-black italic tracking-tighter text-white">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Governance Analytics Bar */}
      <GlassCard className="!p-6 mb-8 border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black italic tracking-tighter uppercase text-sm flex items-center gap-3">
            <BarChart3 className="text-[var(--accent)]" size={16} />
            Governance Distribution
          </h3>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{petitions.length} Total Cases</span>
        </div>
        <div className="w-full h-6 bg-white/5 rounded-full overflow-hidden flex">
          {petitions.length > 0 ? (
            <>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(approvedCount / petitions.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-emerald-500/80 relative group cursor-pointer"
              >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Approved {approvedCount}
                </span>
              </motion.div>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(pendingCount / petitions.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-amber-500/80 relative group cursor-pointer"
              >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Pending {pendingCount}
                </span>
              </motion.div>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(rejectedCount / petitions.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                className="h-full bg-red-500/80 relative group cursor-pointer"
              >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Rejected {rejectedCount}
                </span>
              </motion.div>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10">No Data</div>
          )}
        </div>
        <div className="flex gap-6 mt-3">
          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Approved</span>
          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Pending</span>
          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/30"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Rejected</span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Intelligence Feed */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GlassCard className="!p-8 flex flex-col gap-6 flex-1 border-white/5">
            <div className="flex justify-between items-center">
              <h3 className="font-black italic tracking-tighter uppercase text-lg flex items-center gap-3">
                <Activity className="text-[var(--accent)]" size={18} />
                Neural Scans
              </h3>
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_15px_var(--accent)]"></span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
              {liveFeed.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-white/[0.02] p-8 text-center min-h-[150px]">
                  <Activity size={28} className="text-white/10 mb-3 animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20 mb-4">Awaiting Regional Telemetry...</p>

                  {petitions.length > 0 && (
                    <div className="w-full space-y-2 text-left bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] uppercase tracking-widest font-black text-[var(--accent)] mb-2">Aggregate Urban Needs</p>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-white/40 font-bold uppercase">Education</span>
                        <span className="text-sm font-black italic">{Math.round(petitions.reduce((acc, p) => acc + (p.population / 2500), 0))} Units</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-white/40 font-bold uppercase">Healthcare</span>
                        <span className="text-sm font-black italic">{Math.round(petitions.reduce((acc, p) => acc + (p.population / 10000), 0))} Units</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] text-white/40 font-bold uppercase">Financial</span>
                        <span className="text-sm font-black italic">{Math.round(petitions.reduce((acc, p) => acc + (p.population / 2000), 0))} Units</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : liveFeed.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className="p-4 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-[var(--accent)]/40 transition-all"
                >
                  <div className="flex justify-between items-start mb-1 relative z-10">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.type === 'critical' ? 'text-red-400' : 'text-[var(--accent)]'}`}>
                      {item.type}
                    </span>
                    <span className="text-[9px] text-white/20 font-black">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-white/60 font-medium relative z-10 italic">"{item.message}"</p>
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Admin Activity Log */}
          <GlassCard className="!p-8 flex flex-col gap-6 border-white/5">
            <h3 className="font-black italic tracking-tighter uppercase text-lg flex items-center gap-3">
              <Zap className="text-amber-400" size={18} />
              Admin Activity Log
            </h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {adminLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.02] p-6 text-center">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-white/15">No actions recorded yet</p>
                </div>
              ) : adminLog.map((log, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                  <span className="text-[10px] text-white/50 font-medium flex-1">{log.action}</span>
                  <span className="text-[9px] text-white/20 font-mono shrink-0">{log.time}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Global Petition Queue */}
        <GlassCard className="lg:col-span-2 !p-0 overflow-hidden flex flex-col border-white/5 min-h-[600px]">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">National Reform Queue</h2>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">Awaiting Executive Determination</p>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03] text-[10px] uppercase font-black text-white/40 tracking-[0.3em] border-b border-white/5">
                  <th className="p-6">Origin Sector</th>
                  <th className="p-6 text-center">Severity</th>
                  <th className="p-6">Author</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence mode="popLayout">
                  {petitions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-20 text-center font-black uppercase tracking-[0.5em] text-white/10 italic">No Active Cases Found</td>
                    </tr>
                  ) : petitions.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedPetition(item)}
                      className="border-b border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors group"
                    >
                      <td className="p-6 group-hover:pl-8 transition-all">
                        <div className="flex flex-col">
                          <span className="font-black italic text-white uppercase tracking-tight">{item.locationName}</span>
                          <span className="text-[9px] text-white/20 font-bold tracking-widest uppercase mt-1">ID: {item.id.slice(-8)}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.severityScore > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[var(--accent)] shadow-[0_0_10px_rgba(0,245,255,0.5)]'}`} style={{ width: `${item.severityScore}%` }}></div>
                          </div>
                          <span className={`text-[10px] font-black ${item.severityScore > 80 ? 'text-red-400' : 'text-[var(--accent)]'}`}>{item.severityScore}%</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white/60">{item.creator?.name || 'CITIZEN-ANON'}</span>
                          <span className="text-[9px] text-white/20 font-bold uppercase">{item.creator?.email}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-3">
                          {item.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item.id, 'APPROVED'); }}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-black transition-all"
                              >
                                <CheckCircle2 size={12} /> Approve
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(item.id, 'REJECTED'); }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-black transition-all"
                              >
                                <XCircle size={12} /> Reject
                              </button>
                            </>
                          ) : (
                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="p-8 mt-auto bg-white/[0.01]">
            <div className="flex items-center gap-4 p-6 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-3xl relative overflow-hidden group">
              <TrendingUp size={24} className="text-[var(--accent)] shrink-0 animate-pulse" />
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-1">Neural Strategy Proactive Analysis</h4>
                <p className="text-xs text-white/60 leading-relaxed font-medium italic">"{recommendation}"</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Executive Review Modal */}
      <AnimatePresence>
        {selectedPetition && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPetition(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0a1120] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-10 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] shadow-[0_0_30px_rgba(0,245,255,0.1)]">
                    <FileSearch size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-1">Executive Review</h2>
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/40 italic leading-none">Case ID: {selectedPetition.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPetition(null)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all text-white/40"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                {/* Author Deep Dive */}
                <section>
                  <label className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--accent)] mb-6 block">I. Citizen Intelligence Profile</label>
                  <div className="flex items-center gap-8 p-8 bg-white/5 border border-white/5 rounded-3xl">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center text-black font-black text-3xl">
                      {selectedPetition.creator?.name?.[0].toUpperCase()}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black italic tracking-tight">{selectedPetition.creator?.name}</h3>
                      <p className="text-white/40 font-medium italic">Verified Resident: {selectedPetition.creator?.email}</p>
                    </div>
                  </div>
                </section>

                {/* Case Substance */}
                <section>
                  <label className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--accent)] mb-6 block">II. Petition Sub-Sector Briefing</label>
                  <div className="space-y-6">
                    <h1 className="text-4xl font-black tracking-tighter uppercase leading-[0.9] italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                      {selectedPetition.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest italic py-4 border-y border-white/5">
                      <MapIcon size={14} className="text-[var(--accent)]" />
                      {selectedPetition.locationName}
                    </div>
                    <p className="text-lg leading-loose text-white/70 italic font-medium pt-4 bg-white/[0.01] p-8 rounded-3xl border border-white/5">
                      "{selectedPetition.content}"
                    </p>
                  </div>
                </section>

                {/* Data Telemetry */}
                <section>
                  <label className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--accent)] mb-6 block">III. Regional Telemetry Analysis</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                      <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20 mb-2 block">Severity Index</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black italic text-red-500">{selectedPetition.severityScore}%</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Immediate Risk</span>
                      </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                      <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/20 mb-2 block">Estimated Impact</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black italic text-[var(--accent)]">{selectedPetition.population.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Citizens Affected</span>
                      </div>
                    </div>
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl col-span-1 md:col-span-2">
                      <span className="text-[9px] uppercase font-black tracking-[0.3em] text-[var(--accent)] mb-4 block underline underline-offset-4">Proactive Resource Requirements</span>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-[8px] uppercase font-black text-white/30 mb-1">Education</p>
                          <p className="text-xl font-black italic text-white">{Math.round(selectedPetition.population / 2500)} <span className="text-[10px] text-white/40 not-italic uppercase ml-1">Units</span></p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-black text-white/30 mb-1">Healthcare</p>
                          <p className="text-xl font-black italic text-white">{Math.round(selectedPetition.population / 10000)} <span className="text-[10px] text-white/40 not-italic uppercase ml-1">Units</span></p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-black text-white/30 mb-1">Financial</p>
                          <p className="text-xl font-black italic text-white">{Math.round(selectedPetition.population / 2000)} <span className="text-[10px] text-white/40 not-italic uppercase ml-1">Units</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="p-10 border-t border-white/5 flex gap-4 bg-white/[0.02]">
                <button
                  onClick={() => {
                    const isApproved = selectedPetition.status === 'APPROVED';
                    const isRejected = selectedPetition.status === 'REJECTED';

                    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Executive Briefing - ${selectedPetition.id}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a1120; padding: 40px; color: #fff; }
    .document { background: #0d172a; max-width: 850px; margin: 0 auto; border: 2px solid #1e293b; padding: 60px; position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.5); border-top: 10px solid #00f5ff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 30px; margin-bottom: 40px; }
    .header-left h1 { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; italic: true; color: #fff; }
    .header-left p { margin: 5px 0 0; font-size: 10px; letter-spacing: 5px; color: #00f5ff; font-weight: 900; text-transform: uppercase; }
    .clearance-badge { border: 1px solid #ef4444; color: #ef4444; padding: 8px 15px; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
    .section-label { font-size: 11px; font-weight: 900; letter-spacing: 4px; color: #00f5ff; text-transform: uppercase; margin-bottom: 25px; display: block; opacity: 0.8; }
    .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px; }
    .data-item { border-left: 2px solid rgba(255,255,255,0.05); padding-left: 20px; }
    .data-label { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; font-weight: 800; margin-bottom: 5px; }
    .data-value { font-size: 18px; font-weight: 800; color: #fff; }
    .substance-box { background: rgba(255,255,255,0.02); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); font-size: 16px; line-height: 1.8; color: rgba(255,255,255,0.7); font-style: italic; margin-bottom: 50px; }
    .verdict-banner { background: ${isApproved ? 'rgba(16,185,129,0.1)' : isRejected ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.2)'}; border: 1px solid ${isApproved ? '#10b981' : isRejected ? '#ef4444' : '#334155'}; padding: 30px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; }
    .verdict-status { font-size: 32px; font-weight: 900; color: ${isApproved ? '#10b981' : isRejected ? '#ef4444' : '#fff'}; text-transform: uppercase; italic: true; letter-spacing: -1px; }
    .footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; font-size: 9px; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 2px; }
  </style>
</head>
<body>
  <div class="document">
    <div class="header">
      <div class="header-left">
        <h1>Executive Intelligence Brief</h1>
        <p>COMMAND CENTER // INFRALENSE OS</p>
      </div>
      <div class="clearance-badge">LEVEL 4 CLEARANCE REQUIRED</div>
    </div>
    
    <div class="content">
      <span class="section-label">I. CASE IDENTIFICATION</span>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 50px;">
        <div class="data-item"><div class="data-label">Case Index</div><div class="data-value">${selectedPetition.id}</div></div>
        <div class="data-item"><div class="data-label">Authored By</div><div class="data-value">${selectedPetition.creator?.name}</div></div>
        <div class="data-item"><div class="data-label">Origin Sector</div><div class="data-value">${selectedPetition.locationName}</div></div>
        <div class="data-item"><div class="data-label">Report Date</div><div class="data-value">${new Date(selectedPetition.createdAt).toLocaleString()}</div></div>
      </div>

      <span class="section-label">II. REGIONAL TELEMETRY</span>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 50px;">
        <div class="data-item"><div class="data-label">Severity Index</div><div class="data-value" style="color: ${selectedPetition.severityScore > 80 ? '#ef4444' : '#00f5ff'}">${selectedPetition.severityScore}%</div></div>
        <div class="data-item"><div class="data-label">Population Impact</div><div class="data-value">${selectedPetition.population.toLocaleString()} Units</div></div>
      </div>

      <span class="section-label">III. PETITION SUBSTANCE</span>
      <div class="substance-box">
        "${selectedPetition.content}"
      </div>

      <span class="section-label">IV. EXECUTIVE VERDICT</span>
      <div class="verdict-banner">
        <div>
          <div class="data-label">DETERMINATION STATUS</div>
          <div class="verdict-status">${selectedPetition.status}</div>
        </div>
        <div style="text-align: right">
          <div class="data-label">AUTHORIZED VIA</div>
          <div style="color: #fff; font-weight: 900; font-size: 14px;">NEURAL CORE ALPHA v2.0</div>
        </div>
      </div>

      <div class="footer">
        <div>DIGITALLY SIGNED // COMMAND_CENTER_SECURE_AUTH</div>
        <div>CONFIDENTIAL // DO NOT REDISTRIBUTE</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
                    const blob = new Blob([htmlContent], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Executive_Briefing_${selectedPetition.id.slice(0, 8)}.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 py-4 bg-[var(--accent)] text-black font-black uppercase text-xs rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,245,255,0.3)] transition-all"
                >
                  <Download size={16} /> Download Executive Briefing
                </button>
                {selectedPetition.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { handleUpdateStatus(selectedPetition.id, 'APPROVED'); setSelectedPetition(null); }}
                      className="px-10 py-5 bg-emerald-500 rounded-2xl text-black font-black uppercase text-xs hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => { handleUpdateStatus(selectedPetition.id, 'REJECTED'); setSelectedPetition(null); }}
                      className="px-10 py-5 bg-red-500 rounded-2xl text-white font-black uppercase text-xs hover:bg-red-400 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
