'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/src/context/LoadingContext';

export function SleekLoader() {
  const { isLoading } = useLoading();
  const [progress, setProgress] = useState(0);

  // Top Progress Bar Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        });
      }, 200);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Top Neon Progress Bar */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: progress / 100, opacity: 1 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 h-1 bg-[#4CE3BC] shadow-[0_0_15px_#4CE3BC] z-[9999] origin-left"
          />

          {/* Spirit Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-md"
          >
            <div className="relative">
              {/* Diffused Glow Background */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#4CE3BC]/20 blur-[60px] rounded-full scale-150"
              />
              
              {/* Fluid Spirit Animation */}
              <svg width="80" height="80" viewBox="0 0 100 100" className="relative z-10">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="10"
                  fill="#4CE3BC"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                    x: [0, 10, -10, 0],
                    y: [0, -10, 10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ filter: 'blur(4px)' }}
                />
                <motion.path
                  d="M50 50 Q 70 30 50 10 Q 30 30 50 50"
                  stroke="#4CE3BC"
                  strokeWidth="2"
                  fill="none"
                  animate={{
                    d: [
                      "M50 50 Q 70 30 50 10 Q 30 30 50 50",
                      "M50 50 Q 80 50 50 80 Q 20 50 50 50",
                      "M50 50 Q 70 30 50 10 Q 30 30 50 50"
                    ],
                    opacity: [0.3, 0.8, 0.3],
                    strokeWidth: [2, 4, 2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </svg>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4CE3BC]/80 text-center mt-4 drop-shadow-[0_0_8px_rgba(76,227,188,0.5)]"
              >
                Syncing.
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
