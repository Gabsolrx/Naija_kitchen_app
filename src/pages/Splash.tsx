import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-brand-blue)] text-white w-full h-full relative overflow-hidden">
      {/* Decorative background circles */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/4 -right-20 w-64 h-64 rounded-full bg-[var(--color-brand-yellow)]"
      />
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[var(--color-brand-orange)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center z-10"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
          <span className="text-[var(--color-brand-orange)] font-bold text-5xl">N</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">NaijaKitchen</h1>
        <p className="text-[var(--color-brand-yellow)] font-medium text-lg text-center px-8">
          Cook Nigerian. Eat Better.
        </p>
      </motion.div>
    </div>
  );
}
