import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedPage — wraps any page with a smooth fade+slide-up entrance.
 * Usage: wrap page content in <AnimatedPage> ... </AnimatedPage>
 */
export default function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
}
