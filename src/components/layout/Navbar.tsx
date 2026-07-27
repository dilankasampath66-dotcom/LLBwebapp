'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { UserMenu } from './UserMenu';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { name: 'Subject Content', href: '/content' },
    { name: 'Landmark Judgements', href: '/judgements' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-accent tracking-wider group-hover:text-accent/90 transition-colors">
                  OUSL
                </span>
                <span className="text-xs font-medium text-text-secondary tracking-widest uppercase">
                  Law Portal
                </span>
              </div>
            </Link>

            {/* Desktop Tabs */}
            <div className="hidden md:flex flex-1 items-center justify-center h-full space-x-8">
              {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                      "relative h-full flex items-center px-1 text-sm font-medium transition-colors",
                      isActive ? "text-primary-light" : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {tab.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-light"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right - User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {session?.user ? (
                <UserMenu user={session.user} />
              ) : (
                <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="text-text-secondary hover:text-white p-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-surface z-50 shadow-xl flex flex-col md:hidden border-l border-border"
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <span className="font-serif text-xl font-bold text-accent">OUSL</span>
                <button
                  type="button"
                  className="text-text-secondary hover:text-white p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-2 space-y-1">
                  {tabs.map((tab) => {
                    const isActive = pathname.startsWith(tab.href);
                    return (
                      <Link
                        key={tab.name}
                        href={tab.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                          isActive 
                            ? "bg-primary/20 text-primary-light" 
                            : "text-text-secondary hover:bg-surface-hover hover:text-white"
                        )}
                      >
                        {tab.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 px-4 border-t border-border pt-4">
                  {session?.user ? (
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar name={session.user.fullName || 'User'} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{session.user.fullName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px]">{session.user.role}</Badge>
                          <span className="text-xs text-text-secondary">Year {session.user.studyYear}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-light transition-colors text-center"
                    >
                      Sign In
                    </Link>
                  )}
                  
                  {session?.user && (
                    <div className="mt-4 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
                      >
                        My Profile
                      </Link>
                      
                      {session.user.tutorStatus === 'NONE' && (
                        <Link
                          href="/apply-tutor"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
                        >
                          Apply to become a tutor
                        </Link>
                      )}
                      
                      {session.user.role === 'TUTOR' && (
                        <Link
                          href="/tutor"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
                        >
                          Tutor Dashboard
                        </Link>
                      )}

                      {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-surface-hover hover:text-white transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          // add logout handler later
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-error/10 transition-colors mt-4"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
