import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import { Users, ArrowLeft, Search, ShieldCheck, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CitizenManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/petitions/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch { }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020812] text-white p-8">
      <header className="flex items-center gap-6 mb-10">
        <Link to="/admin" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[var(--accent)] transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Citizen Registry</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">National Resident Intelligence Database</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search citizens..."
            className="pl-10 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-medium focus:border-[var(--accent)] outline-none transition-all w-72"
          />
        </div>
      </header>

      <GlassCard className="!p-0 overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.03] text-[10px] uppercase font-black text-white/40 tracking-[0.3em] border-b border-white/5">
              <th className="p-6">Citizen</th>
              <th className="p-6 text-center">Role</th>
              <th className="p-6 text-center">Petitions</th>
              <th className="p-6 text-center">Approved</th>
              <th className="p-6 text-center">Severity Avg</th>
              <th className="p-6">Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => {
              const approved = user.petitions?.filter((p: any) => p.status === 'APPROVED').length || 0;
              const avgSev = user.petitions?.length > 0
                ? Math.round(user.petitions.reduce((s: number, p: any) => s + p.severityScore, 0) / user.petitions.length)
                : 0;
              const isExpanded = expandedUser === user.id;

              return (
                <React.Fragment key={user.id}>
                  <motion.tr
                    onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                    className="border-b border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-blue-600 flex items-center justify-center text-black font-black text-sm">
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-black text-sm">{user.name}</span>
                          <div className="flex items-center gap-1.5 text-white/30 text-[9px] mt-0.5">
                            <Mail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-white/5 text-white/40'
                        }`}>{user.role}</span>
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-lg font-black">{user.petitions?.length || 0}</span>
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-lg font-black text-emerald-400">{approved}</span>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`text-lg font-black ${avgSev > 70 ? 'text-red-400' : 'text-[var(--accent)]'}`}>{avgSev}%</span>
                    </td>
                    <td className="p-6 text-[10px] text-white/30 font-mono">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                  {isExpanded && user.petitions?.length > 0 && (
                    <tr>
                      <td colSpan={6} className="bg-white/[0.02] p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {user.petitions.map((p: any) => (
                            <div key={p.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                              <FileText size={14} className="text-white/20 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-mono text-white/30 block">ID: {p.id.slice(-8)}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${p.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                                  p.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                    'bg-amber-500/20 text-amber-400'
                                }`}>{p.status}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default CitizenManagement;
