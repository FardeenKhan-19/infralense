import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { AlertCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Petition {
  id: string;
  location: string;
  category: string;
  status: 'pending' | 'reviewing' | 'resolved';
  severity: number;
}

const initialPetitions: Petition[] = [
  { id: '1', location: 'Lagos, Nigeria', category: 'Healthcare', status: 'pending', severity: 85 },
  { id: '2', location: 'Mumbai, India', category: 'Education', status: 'reviewing', severity: 92 },
  { id: '3', location: 'Nairobi, Kenya', category: 'Financial', status: 'pending', severity: 64 },
  { id: '4', location: 'Jakarta, Indonesia', category: 'Healthcare', status: 'reviewing', severity: 78 },
  { id: '5', location: 'Cairo, Egypt', category: 'Education', status: 'resolved', severity: 45 },
];

const PetitionKanban: React.FC = () => {
  const [petitions, setPetitions] = useState<Petition[]>(initialPetitions);

  const movePetition = (id: string, newStatus: Petition['status']) => {
    setPetitions(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const columns = [
    { title: 'Awaiting Action', status: 'pending', icon: <AlertCircle className="text-red-400" size={16} /> },
    { title: 'Under Review', status: 'reviewing', icon: <Clock className="text-blue-400" size={16} /> },
    { title: 'Resolved', status: 'resolved', icon: <CheckCircle className="text-emerald-400" size={16} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(col => (
        <div key={col.status} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            {col.icon}
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-secondary)]">
              {col.title} ({petitions.filter(p => p.status === col.status).length})
            </h3>
          </div>
          
          <div className="flex flex-col gap-3 min-h-[400px] p-2 bg-white/5 border border-dashed border-[var(--border)] rounded-2xl">
            <AnimatePresence mode="popLayout">
              {petitions
                .filter(p => p.status === col.status)
                .map(p => (
                  <motion.div
                    layout
                    key={p.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl group hover:border-[var(--accent)] transition-colors shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[var(--accent)] uppercase">{p.category}</span>
                      <div className={`w-2 h-2 rounded-full ${p.severity > 70 ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{p.location}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] mb-4">ID: #{p.id.padStart(4, '0')}</p>
                    
                    <div className="flex justify-end gap-2">
                      {p.status !== 'resolved' && (
                        <button 
                          onClick={() => movePetition(p.id, p.status === 'pending' ? 'reviewing' : 'resolved')}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[var(--accent)] hover:text-[#020812] transition-colors"
                        >
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetitionKanban;
