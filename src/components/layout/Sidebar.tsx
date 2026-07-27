'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-16 left-0 z-40 p-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-[hsl(220,16%,16%)] border border-[hsl(220,15%,20%)] text-[hsl(220,10%,92%)] shadow-md"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-50 w-64 bg-[hsl(220,16%,16%)] border-r border-[hsl(220,15%,20%)] flex flex-col",
          "md:translate-x-0 transition-transform duration-300 ease-in-out"
        )}
        initial={false}
        animate={{ x: isOpen ? 0 : 'var(--sidebar-translate-x)' }}
        style={{
          '--sidebar-translate-x': '-100%',
        } as React.CSSProperties}
      >
        <div className="p-6 md:p-6 md:pt-8 flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200",
                    "hover:bg-[hsl(220,15%,20%)] hover:text-white group",
                    isActive
                      ? "bg-[hsl(220,15%,20%)] text-white border-l-4 border-[hsl(345,65%,25%)] rounded-l-none"
                      : "text-[hsl(220,10%,60%)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive ? "text-[hsl(345,65%,25%)]" : "text-[hsl(220,10%,60%)] group-hover:text-[hsl(220,10%,92%)]"
                    )} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <motion.div
                      key={item.badge}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Badge variant="primary" className="bg-[hsl(345,65%,25%)] text-white border-none min-w-[20px] text-center justify-center">
                        {item.badge}
                      </Badge>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Added desktop override for CSS variables */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 768px) {
            aside {
              --sidebar-translate-x: 0 !important;
              transform: translateX(0) !important;
            }
          }
        `}} />
      </motion.aside>
    </>
  );
}
