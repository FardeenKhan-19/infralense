import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Globe2,
  Cpu,
  Activity,
  Shield,
  Database,
  Fingerprint,
  Map as MapIcon,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Waves } from '../components/ui/wave-background';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([
    '[PETITION GENERATED: REGIONAL REFORM]',
    '[DATA LATENCY: <12MS]',
    '[NEURAL PARITY: OPTIMIZED]',
    '[SCANNING SECTOR: 564-A]',
  ]);
  const [clearanceId, setClearanceId] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        `[SCANNING SECTOR: ${Math.floor(Math.random() * 900)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}]`,
        `[GAP DETECTED: ${Math.floor(Math.random() * 100)}%]`,
        '[NEURAL PARITY: OPTIMIZED]',
        '[PETITION GENERATED: REGIONAL REFORM]',
        '[DATA LATENCY: <12MS]'
      ];
      setLogs(prev => [...prev.slice(-4), messages[Math.floor(Math.random() * messages.length)]]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clearanceId) return;
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      toast.success('Clearance Authorized. Establishing Link.');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020812] text-white relative overflow-hidden landing-font selection:bg-[var(--accent)] selection:text-black font-sans">
      {/* Background FX - Cyan Grid Overlay + Interactive Waves */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.08),transparent_70%)]" />
        <div className="absolute inset-0 grid-cyan opacity-40" />
        <Waves className="opacity-30" strokeColor="rgba(0, 245, 255, 0.2)" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-10 py-8 flex justify-between items-center bg-transparent">
        <Link to="/" className="flex items-center gap-4 group cursor-pointer">
          <img
            src="/logo.png"
            alt="Infralense Logo"
            className="h-12 w-12 rounded-full aspect-square object-cover filter brightness-125 group-hover:scale-105 transition-all duration-300 border-2 border-[var(--accent)]/20 shadow-[0_0_20px_rgba(0,245,255,0.2)]"
          />
        </Link>
        <div className="flex gap-10 items-center">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-[var(--accent)] transition-colors">Neural Login</Link>
          <Link to="/admin/login">
            <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-all">Admin System</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-10 flex flex-col items-center">
        <div className="max-w-7xl w-full flex flex-col items-center relative z-10">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[var(--accent)] text-[9px] font-black uppercase tracking-[0.4em]"
          >
            <Activity size={12} className="animate-pulse" /> Intelligence Platform Live: Sector Tier-1
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--accent)] text-[12px] font-black uppercase tracking-[1.2em] mb-4 opacity-100 ml-[1.2em]"
          >
            Infralense
          </motion.div>

          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl lg:text-[11rem] font-black italic tracking-tighter leading-[0.85] text-white uppercase"
            >
              Data-Driven <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--accent)] to-white animate-shimmer bg-size-200">Governance.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-white/40 mb-16 max-w-3xl mx-auto text-center font-medium uppercase tracking-tight landing-font-body"
          >
            Transforming regionals through <span className="text-white font-black italic">Neural Scanning</span> and <span className="text-[var(--accent)] font-black italic">Macro Intelligence</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-32"
          >
            <Link to="/login">
              <button className="h-14 px-10 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl hover:bg-[var(--accent)] hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all">
                Access Intelligence Hub
              </button>
            </Link>
            <button className="h-14 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-white/40 hover:text-white flex items-center gap-3">
              <Play size={14} className="text-[var(--accent)]" /> Watch System Demo
            </button>
          </motion.div>

          {/* Macro System Telemetry Card - Image 2 Integration */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full max-w-5xl group"
          >
            <div className="bg-[#0a1120]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row min-h-[450px]">
              {/* Left Panel: Logs & Stats */}
              <div className="w-full md:w-[45%] p-10 border-r border-white/5 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-white/40">
                    <ChevronRight size={16} className="text-[var(--accent)]" />
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em]">Macro System Telemetry</h4>
                  </div>

                  <div className="space-y-4 font-mono text-[10px]">
                    <AnimatePresence mode="popLayout">
                      {logs.map((log, i) => (
                        <motion.div
                          key={log + i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1 - i * 0.15, x: 0 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-white/10">{i + 1}</span>
                          <span className="font-bold text-white/80 uppercase tracking-tight">{log}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10 pt-10 mt-10 border-t border-white/5">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Global Stability</p>
                    <p className="text-4xl font-black italic tracking-tighter text-white/60 group-hover:text-white transition-colors">84.2%</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Parity</p>
                    <p className="text-4xl font-black italic tracking-tighter text-[var(--accent)]">ACTIVE</p>
                  </div>
                </div>
              </div>

              {/* Right Panel: Holographic Globe */}
              <div className="flex-1 p-10 relative flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.03),transparent_70%)]" />

                <div className="relative z-10">
                  <div className="absolute inset-0 border-2 border-[var(--accent)]/5 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute -inset-4 border border-[var(--accent)]/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

                  <div className="w-64 h-64 rounded-full border-2 border-[var(--accent)]/20 flex items-center justify-center relative overflow-hidden group/globe">
                    <div className="absolute inset-0 bg-[var(--accent)]/5 blur-2xl group-hover/globe:bg-[var(--accent)]/10 transition-all" />
                    <Globe2 size={120} className="text-[var(--accent)] opacity-40 animate-pulse" />

                    {/* Abstract waves across the globe from image */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]" />
                        <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]" />
                        <path d="M0,40 Q25,20 50,40 T100,40" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]" />
                      </svg>
                    </div>
                  </div>

                  {/* Targeted location scan effect */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 border border-[var(--accent)] rounded-full blur-[2px]"
                  />
                </div>

                {/* Region Metadata from image */}
                <div className="absolute bottom-10 left-10 right-10 p-5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl flex justify-between items-center group/meta">
                  <div className="flex items-center gap-4">
                    <Cpu size={14} className="text-[var(--accent)] group-hover/meta:rotate-90 transition-transform duration-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 group-hover/meta:text-white transition-colors">Targeting Mumbai Sector-9</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grids */}
      <section className="py-40 px-10 relative z-10 bg-gradient-to-b from-transparent via-[#020812] to-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<MapIcon />}
            title="Geospatial Mapping"
            desc="Deep infrastructure layers utilizing OSM and OpenData datasets for 100% regional visibility."
          />
          <FeatureCard
            icon={<Database />}
            title="Predictive Models"
            desc="Machine learning algorithms projecting 5-year growth and hospital-to-school gap ratios."
          />
          <FeatureCard
            icon={<Shield />}
            title="Civic Advocacy"
            desc="One-click AI generation of verifiable petitions to national and local authorities."
          />
        </div>
      </section>

      {/* Clearance Section */}
      <section className="py-60 px-10 relative text-center bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mx-auto mb-10 shadow-2xl group cursor-pointer hover:border-[var(--accent)]/40 transition-all">
            <Fingerprint size={40} className="text-white group-hover:text-[var(--accent)] transition-colors" />
          </div>

          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-10">
            Request <span className="text-[var(--accent)]">Clearance</span>
          </h2>

          <p className="text-white/40 text-lg md:text-xl font-medium uppercase tracking-tight mb-20 max-w-2xl mx-auto leading-relaxed landing-font-body">
            Establishing a regional oversight presence requires validated agency credentials. Complete your synchronization below.
          </p>

          <div className="max-w-xl mx-auto p-1 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
            <div className="bg-[#020812] rounded-[2.3rem] p-10">
              <AnimatePresence mode="wait">
                {!isAuthorizing ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleClearance}
                    className="flex flex-col gap-8"
                  >
                    <div className="space-y-4 text-left">
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Agency Clearance ID</label>
                      <input
                        type="text"
                        value={clearanceId}
                        onChange={(e) => setClearanceId(e.target.value)}
                        required
                        placeholder="SEC-ALPHA-2026-N"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-sm text-white focus:border-[var(--accent)] focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/10 font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.4em] rounded-2xl hover:bg-[var(--accent)] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all flex items-center justify-center gap-4 group"
                    >
                      Initialize Oversight Link
                      <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center gap-6"
                  >
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 border-2 border-[var(--accent)]/10 rounded-full" />
                      <div className="absolute inset-0 border-2 border-[var(--accent)] rounded-full border-t-transparent animate-spin" />
                      <Fingerprint size={32} className="absolute inset-0 m-auto text-[var(--accent)] animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-2">Authorizing Credentials</p>
                      <p className="text-xs text-white/40 font-medium tracking-tight">Establishing Satellite Link...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="py-20 px-10 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-30 group">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-[0.5em] font-black group-hover:text-white transition-colors">Infra Lense Intelligence © 2026</span>
            <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-[var(--accent)]">Project Neural-Alpha Deployment</span>
          </div>
          <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Protocol</a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Database</a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors">Terminal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="p-12 bg-white/5 border border-white/5 rounded-[3rem] group hover:bg-white/10 hover:border-[var(--accent)]/20 transition-all duration-500 relative overflow-hidden">
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full group-hover:bg-[var(--accent)]/10 transition-colors" />
    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 text-white group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/40 transition-all shadow-xl">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-3xl font-black mb-6 text-white uppercase italic tracking-tighter group-hover:translate-x-2 transition-transform">{title}</h3>
    <p className="text-white/40 leading-relaxed text-[14px] font-medium uppercase tracking-tight landing-font-body">{desc}</p>
  </div>
);

export default Landing;
