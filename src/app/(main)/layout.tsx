import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { requireAuth } from '@/lib/rbac';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAuth();
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
