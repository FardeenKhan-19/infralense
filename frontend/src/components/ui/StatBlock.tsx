import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../../lib/animations';

interface StatBlockProps {
  label: string;
  value: number | string;
  target?: number | string;
  futureTarget?: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value, target, futureTarget, icon, color }) => {
  const percentage = typeof value === 'number' && typeof target === 'number' 
    ? Math.min(100, (value / target) * 100) 
    : 0;

  return (
    <motion.div variants={scaleIn} className="bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border)] relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-tighter mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold mono">{value}</span>
            {target && <span className="text-[var(--text-muted)] text-xs">/ {target} target</span>}
          </div>
          {futureTarget && (
            <p className="text-[var(--warning)] text-[10px] mt-1 font-bold italic">
              Future Need (5Y): {futureTarget}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-${color}`}>
          {icon}
        </div>
      </div>
      
      {target && (
        <div className="mt-4 h-1 w-full bg-[#1a2b3c] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${color.replace('text-', 'bg-')}`}
          />
        </div>
      )}
    </motion.div>
  );
};

export default StatBlock;
