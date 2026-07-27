'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14161B] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1C1619] via-[#14161B] to-[#14161B] p-4 sm:p-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="w-full max-w-[460px] relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="inline-block group focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#14161B] rounded-lg p-1">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#D4AF37] font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
              OUSL
            </h1>
            <p className="text-[#999999] text-sm mt-1 font-medium uppercase tracking-wider">
              Department of Legal Studies
            </p>
          </Link>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#1C1F26]/90 backdrop-blur-md border border-[#2B2F39] rounded-2xl p-6 sm:p-8 shadow-2xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
