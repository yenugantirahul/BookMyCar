'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner({ message = 'Curating experience...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[250px] space-y-6">
      <div className="relative w-16 h-16">
        <motion.span
          className="absolute inset-0 border-4 border-slate-100 rounded-full"
        />
        <motion.span
          className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-indigo-600/10 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-semibold tracking-wide text-slate-500 uppercase"
      >
        {message}
      </motion.p>
    </div>
  );
}
