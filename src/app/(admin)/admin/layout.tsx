'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { UserPlus, ClipboardCheck, Library, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';

interface Counts {
  pendingTutors: number;
  pendingContent: number;
  pendingDeleteRequests: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [counts, setCounts] = useState<Counts>({ pendingTutors: 0, pendingContent: 0, pendingDeleteRequests: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/');
    }
    
    if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
        redirect('/');
      }
    }
  }, [session, status]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/admin/counts');
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#14161a]">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
    );
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  const sidebarItems = [
    {
      href: '/admin/tutor-requests',
      label: 'Tutor Requests',
      icon: UserPlus,
      badge: counts.pendingTutors,
    },
    {
      href: '/admin/content-queue',
      label: 'Content Queue',
      icon: ClipboardCheck,
      badge: counts.pendingContent,
    },
    {
      href: '/admin/content-library',
      label: 'Content Library',
      icon: Library,
    },
    {
      href: '/admin/delete-requests',
      label: 'Delete Requests',
      icon: Trash2,
      badge: counts.pendingDeleteRequests,
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-[hsl(220,10%,92%)] flex flex-col pt-16">
      <header className="fixed top-0 left-0 right-0 h-16 bg-[hsl(220,18%,12%)] border-b border-[hsl(220,15%,20%)] z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[hsl(220,10%,60%)] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-white">
            Admin Panel
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[hsl(220,10%,60%)] hidden md:inline">Logged in as</span>
          <span className="font-medium text-[hsl(345,65%,65%)]">{session.user.name}</span>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
