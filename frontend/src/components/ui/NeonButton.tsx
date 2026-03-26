import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = "relative px-6 py-3 rounded-[var(--radius-pill)] font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden";
  
  const variants = {
    primary: "bg-[var(--accent)] text-[#020812] hover:shadow-[0_0_20px_var(--accent)]",
    secondary: "border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
    danger: "bg-[var(--danger)] text-white hover:shadow-[0_0_20px_var(--danger)]"
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default NeonButton;
