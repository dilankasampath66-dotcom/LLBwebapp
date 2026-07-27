'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'SUPER_ADMIN')) {
      router.replace('/');
    }
  }, [status, session, router]);

  if (status === 'loading' || !session || session.user.role !== 'SUPER_ADMIN') {
    return <div className="min-h-screen bg-[hsl(220,20%,8%)] flex items-center justify-center text-[hsl(220,10%,92%)]">Loading...</div>;
  }

  const sidebarItems = [
    {
      name: 'Dashboard',
      href: '/superadmin/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      )
    },
    {
      name: 'Branding',
      href: '/superadmin/branding',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
      )
    },
    {
      name: 'Admin Accounts',
      href: '/superadmin/admins',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 7 2a1 1 0 0 1 1 1v7z"/></svg>
      )
    },
    {
      name: 'Delete Approvals',
      href: '/superadmin/delete-approvals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      )
    },
    {
      name: 'Exports',
      href: '/superadmin/exports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] flex flex-col md:flex-row text-[hsl(220,10%,92%)]">
      <Sidebar items={sidebarItems} />
      
      <main className="flex-1 flex flex-col md:ml-64 transition-all duration-300 min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[hsl(220,16%,16%)] border-b border-[hsl(220,15%,20%)]">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif text-[hsl(42,78%,55%)]">Super Admin</h1>
          </div>
          <Link href="/" className="text-sm text-[hsl(220,10%,60%)] hover:text-[hsl(220,10%,92%)] transition-colors">
            Back to Home
          </Link>
        </header>
        
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
