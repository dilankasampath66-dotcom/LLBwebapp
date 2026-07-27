'use client';

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TutorApplicationCard from '@/components/tutor/TutorApplicationCard';

export default function TutorLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-maroon-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const isApproved = session.user?.tutorStatus === 'APPROVED';

  const tabs = [
    { name: 'New Study Content', path: '/tutor/content/new' },
    { name: 'New Judgement', path: '/tutor/judgements/new' },
    { name: 'My Submissions', path: '/tutor/my-submissions' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-zinc-200 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2">/</span>
                </li>
                <li className="text-zinc-200 font-medium">Tutor Dashboard</li>
              </ol>
            </nav>
            <h1 className="mt-2 text-3xl font-playfair font-bold text-zinc-100">
              Tutor Dashboard
            </h1>
          </div>
        </div>

        {!isApproved ? (
          <div className="flex justify-center mt-12">
            <TutorApplicationCard tutorStatus={session.user?.tutorStatus as any} />
          </div>
        ) : (
          <div>
            <div className="border-b border-zinc-800">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => {
                  const isActive = pathname === tab.path || pathname.startsWith(`${tab.path}/`);
                  return (
                    <Link
                      key={tab.name}
                      href={tab.path}
                      className={cn(
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors relative',
                        isActive
                          ? 'border-maroon-600 text-maroon-500'
                          : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      )}
                    >
                      {tab.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-maroon-600"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="mt-8">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
