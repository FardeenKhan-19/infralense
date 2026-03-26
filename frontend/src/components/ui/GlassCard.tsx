import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../../lib/animations';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className={`glass ${hover ? 'glass-hover' : ''} p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
