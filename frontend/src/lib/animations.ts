// Exporting animation objects directly without strict Variants type to avoid import errors
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.4 } 
  }
};

export const slideIn = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 280, damping: 28 } 
  }
};

export const slideUp = {
  hidden: { y: '100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 280, damping: 28 } 
  }
};

export const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { duration: 0.35, ease: 'easeOut' } 
  }
};

export const stagger = {
  visible: { 
    transition: { staggerChildren: 0.08 } 
  }
};
