import React from 'react';
import { motion } from 'framer-motion';

const VerifiedBadge = ({ size = 16, className = "" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Pulsing Outer Ring */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-primary"
      />

      {/* Shield/Circle */}
      <div className="relative w-full h-full bg-primary rounded-full shadow-[0_0_15px_rgba(0,255,255,0.6)] flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-obsidian"
          style={{ width: '70%', height: '70%' }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  );
};

export default VerifiedBadge;
