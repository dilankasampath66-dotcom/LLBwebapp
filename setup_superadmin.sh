#!/bin/bash

# Create directories
mkdir -p "src/app/(superadmin)/superadmin/dashboard"
mkdir -p "src/app/(superadmin)/superadmin/branding"
mkdir -p "src/app/(superadmin)/superadmin/admins"
mkdir -p "src/app/(superadmin)/superadmin/delete-approvals"
mkdir -p "src/app/(superadmin)/superadmin/exports"
mkdir -p "src/app/api/superadmin/dashboard"
mkdir -p "src/app/api/superadmin/branding/upload"
mkdir -p "src/app/api/superadmin/admins/[id]"
mkdir -p "src/app/api/superadmin/delete-approvals/[id]/decide"
mkdir -p "src/app/api/superadmin/export/users"
mkdir -p "src/app/api/superadmin/export/content"

# 1. layout.tsx
cat << 'EOF' > "src/app/(superadmin)/superadmin/layout.tsx"
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
EOF

# 2. dashboard/page.tsx
cat << 'EOF' > "src/app/(superadmin)/superadmin/dashboard/page.tsx"
'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { formatRelativeDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

// Simple CountUp hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/superadmin/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const StatCard = ({ title, value, color, icon }: any) => {
    const displayValue = useCountUp(value, 600);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-xl bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] p-6`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500`} />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[hsl(220,10%,60%)] font-medium">{title}</h3>
          <div className={`text-${color}-500 opacity-80`}>{icon}</div>
        </div>
        <div className="text-4xl font-serif text-[hsl(220,10%,92%)]">{displayValue}</div>
      </motion.div>
    );
  };

  if (loading) return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64 bg-[hsl(220,16%,16%)]" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 bg-[hsl(220,16%,16%)]" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif text-[hsl(220,10%,92%)]">Platform Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={data?.totalStudents || 0} 
          color="blue"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard 
          title="Total Tutors" 
          value={data?.totalTutors || 0} 
          color="rose"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
        />
        <StatCard 
          title="Total Content Items" 
          value={data?.totalContent || 0} 
          color="amber"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>}
        />
        <StatCard 
          title="Total Judgements" 
          value={data?.totalJudgements || 0} 
          color="emerald"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)]">
            <h3 className="text-[hsl(220,10%,60%)] mb-2">Pending Approvals</h3>
            <div className="text-3xl text-[hsl(42,78%,55%)] font-medium">{data?.pendingApprovals || 0}</div>
         </Card>
         <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)]">
            <h3 className="text-[hsl(220,10%,60%)] mb-2">Pending Tutor Applications</h3>
            <div className="text-3xl text-[hsl(42,78%,55%)] font-medium">{data?.pendingTutorApps || 0}</div>
         </Card>
      </div>

      <div>
        <h3 className="text-xl font-serif text-[hsl(220,10%,92%)] mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {data?.recentActivity?.map((activity: any, idx: number) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-[hsl(220,16%,16%)] border-l-4 border-[hsl(42,78%,55%)]"
            >
              <div className="mt-1 opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div>
                <p className="text-[hsl(220,10%,92%)]">{activity.details}</p>
                <p className="text-xs text-[hsl(220,10%,60%)] mt-1">{formatRelativeDate(new Date(activity.createdAt))}</p>
              </div>
            </motion.div>
          ))}
          {(!data?.recentActivity || data.recentActivity.length === 0) && (
            <div className="text-[hsl(220,10%,60%)] p-4 text-center border border-[hsl(220,15%,20%)] rounded-lg border-dashed">No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}
EOF

# 3. branding/page.tsx
cat << 'EOF' > "src/app/(superadmin)/superadmin/branding/page.tsx"
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandingPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bgUrls, setBgUrls] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/superadmin/branding')
      .then(res => res.json())
      .then(d => {
        setSettings(d);
        setHeadline(d.homepageHeadline || '');
        setSubtext(d.homepageSubtext || '');
        setLogoUrl(d.logoUrl || '');
        try {
          setBgUrls(d.homepageBackgroundUrls ? JSON.parse(d.homepageBackgroundUrls) : []);
        } catch(e) { setBgUrls([]); }
        setLoading(false);
      });
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/superadmin/branding/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if(data.url) setLogoUrl(data.url);
    } catch(err) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/superadmin/branding/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if(data.url) setBgUrls(prev => [...prev, data.url]);
    } catch(err) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/superadmin/branding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl,
          homepageBackgroundUrls: JSON.stringify(bgUrls),
          homepageHeadline: headline,
          homepageSubtext: subtext
        })
      });
      toast({ title: 'Settings saved', variant: 'default' });
    } catch(e) {
      toast({ title: 'Error saving settings', variant: 'destructive' });
    }
    setSaving(false);
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-[500px]" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h2 className="text-3xl font-serif text-[hsl(220,10%,92%)]">Site Branding</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)] space-y-4">
            <h3 className="text-lg font-medium">Logo</h3>
            {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 object-contain" />}
            <Input type="file" accept="image/*" onChange={handleLogoUpload} className="bg-[hsl(220,16%,16%)]" />
          </Card>

          <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)] space-y-4">
            <h3 className="text-lg font-medium">Homepage Backgrounds</h3>
            <div className="flex gap-4 flex-wrap">
              {bgUrls.map((url, idx) => (
                <div key={idx} className="relative group w-24 h-24 rounded overflow-hidden">
                  <img src={url} alt="Bg" className="w-full h-full object-cover" />
                  <button onClick={() => setBgUrls(bgUrls.filter((_, i) => i !== idx))} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <Input type="file" accept="image/*" onChange={handleBgUpload} className="bg-[hsl(220,16%,16%)]" />
          </Card>

          <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)] space-y-4">
            <h3 className="text-lg font-medium">Homepage Typography</h3>
            <div>
              <label className="block text-sm text-[hsl(220,10%,60%)] mb-1">Headline</label>
              <Input value={headline} onChange={e => setHeadline(e.target.value)} className="bg-[hsl(220,16%,16%)]" />
            </div>
            <div>
              <label className="block text-sm text-[hsl(220,10%,60%)] mb-1">Subtext</label>
              <textarea 
                value={subtext} 
                onChange={e => setSubtext(e.target.value)} 
                className="w-full rounded-md border border-[hsl(220,15%,20%)] bg-[hsl(220,16%,16%)] px-3 py-2 text-sm text-[hsl(220,10%,92%)] min-h-[100px]" 
              />
            </div>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="bg-[hsl(345,65%,25%)] hover:bg-[hsl(345,55%,40%)]">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div>
          <div className="sticky top-24 border border-[hsl(220,15%,20%)] rounded-xl overflow-hidden aspect-[16/10] relative bg-black">
            <div className="absolute top-2 left-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded">Live Preview</div>
            <AnimatePresence mode="wait">
              {bgUrls[0] && (
                <motion.img 
                  key={bgUrls[0]}
                  src={bgUrls[0]} 
                  alt="bg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-center text-center p-8 z-10 flex-col">
              {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 mb-6 object-contain" />}
              <h1 className="text-2xl font-serif text-white mb-4">{headline || 'Headline'}</h1>
              <p className="text-xs text-white/80 max-w-sm">{subtext || 'Subtext goes here'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# 4. admins/page.tsx
cat << 'EOF' > "src/app/(superadmin)/superadmin/admins/page.tsx"
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchAdmins = async () => {
    const res = await fetch('/api/superadmin/admins');
    const data = await res.json();
    setAdmins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/superadmin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        toast({ title: 'Admin account created. Invite email sent.' });
        setIsAddModalOpen(false);
        setFormData({ fullName: '', email: '', phone: '' });
        fetchAdmins();
      } else {
        toast({ title: 'Error creating admin', variant: 'destructive' });
      }
    } catch(e) {
      toast({ title: 'Error creating admin', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  const handleRemoveConfirm = async () => {
    if (!selectedAdminId) return;
    try {
      const res = await fetch(`/api/superadmin/admins/${selectedAdminId}`, { method: 'DELETE' });
      if(res.ok) {
        toast({ title: 'Admin removed successfully' });
        setAdmins(prev => prev.filter(a => a.id !== selectedAdminId));
      }
    } catch(e) {
      toast({ title: 'Error removing admin', variant: 'destructive' });
    }
    setIsConfirmModalOpen(false);
    setSelectedAdminId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-[hsl(220,10%,92%)]">Admin Accounts</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-[hsl(42,78%,55%)] text-[hsl(220,20%,8%)] hover:bg-[hsl(42,90%,60%)]">
          + Add Admin
        </Button>
      </div>

      <div className="bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[hsl(220,15%,20%)] text-[hsl(220,10%,60%)] text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Date Added</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {!loading && admins.map((admin) => (
                  <motion.tr 
                    key={admin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-[hsl(220,15%,20%)] last:border-0 hover:bg-[hsl(220,16%,16%)] transition-colors text-sm"
                  >
                    <td className="p-4 text-[hsl(220,10%,92%)]">{admin.fullName}</td>
                    <td className="p-4 text-[hsl(220,10%,60%)]">{admin.email}</td>
                    <td className="p-4 text-[hsl(220,10%,60%)]">{admin.phone || '-'}</td>
                    <td className="p-4 text-[hsl(220,10%,60%)]">{formatRelativeDate(new Date(admin.createdAt))}</td>
                    <td className="p-4">
                      <Badge variant={admin.isActive ? 'success' : 'secondary'}>{admin.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[hsl(0,72%,50%)] hover:bg-[hsl(0,72%,50%)]/10"
                        onClick={() => { setSelectedAdminId(admin.id); setIsConfirmModalOpen(true); }}
                      >
                        Remove
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {!loading && admins.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[hsl(220,10%,60%)]">No admin accounts found.</td>
                </tr>
              )}
              {loading && <tr><td colSpan={6} className="p-8 text-center text-[hsl(220,10%,60%)]">Loading...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Admin">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[hsl(220,10%,60%)]">Full Name</label>
            <Input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="bg-[hsl(220,16%,16%)]" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[hsl(220,10%,60%)]">Email</label>
            <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-[hsl(220,16%,16%)]" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[hsl(220,10%,60%)]">Phone (Optional)</label>
            <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-[hsl(220,16%,16%)]" />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-[hsl(345,65%,25%)] hover:bg-[hsl(345,55%,40%)]">
              {submitting ? 'Creating...' : 'Create Admin'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Confirm Removal">
        <p className="text-[hsl(220,10%,92%)] mb-6">Are you sure you want to remove admin access for this user?</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
          <Button onClick={handleRemoveConfirm} className="bg-[hsl(0,72%,50%)] hover:bg-[hsl(0,72%,40%)] text-white">Remove Admin</Button>
        </div>
      </Modal>
    </div>
  );
}
EOF

# 5. delete-approvals/page.tsx
cat << 'EOF' > "src/app/(superadmin)/superadmin/delete-approvals/page.tsx"
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatRelativeDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [denyNote, setDenyNote] = useState('');
  const { toast } = useToast();

  const fetchRequests = async () => {
    const res = await fetch('/api/superadmin/delete-approvals');
    const data = await res.json();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, decision: 'approve'|'deny') => {
    if (decision === 'deny' && !denyNote && actionId !== id) {
      setActionId(id);
      return;
    }
    
    try {
      const res = await fetch(`/api/superadmin/delete-approvals/${id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, note: decision === 'deny' ? denyNote : undefined })
      });
      if(res.ok) {
        toast({ title: `Request ${decision}d successfully` });
        setRequests(prev => prev.filter(r => r.id !== id));
        setActionId(null);
        setDenyNote('');
      }
    } catch(e) {
      toast({ title: 'Error processing request', variant: 'destructive' });
    }
  };

  if (loading) return <div className="text-[hsl(220,10%,92%)]">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-serif text-[hsl(220,10%,92%)]">Delete Approvals</h2>
      
      <div className="space-y-4">
        <AnimatePresence>
          {requests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-medium text-[hsl(220,10%,92%)]">{req.contentDetails?.title || 'Unknown Content'}</h3>
                      <Badge variant="secondary">{req.contentType}</Badge>
                    </div>
                    <p className="text-sm text-[hsl(220,10%,60%)]">
                      Requested by {req.requestedBy.fullName} • {formatRelativeDate(new Date(req.createdAt))}
                    </p>
                    {req.reason && <p className="text-sm mt-2 text-[hsl(0,72%,60%)] bg-[hsl(0,72%,50%)]/10 p-2 rounded">Reason: {req.reason}</p>}
                  </div>
                </div>

                {actionId === req.id ? (
                  <div className="flex gap-2 items-center mt-4 border-t border-[hsl(220,15%,20%)] pt-4">
                    <Input 
                      placeholder="Reason for denial (required)" 
                      value={denyNote} 
                      onChange={e => setDenyNote(e.target.value)} 
                      className="flex-1 bg-[hsl(220,16%,16%)]" 
                    />
                    <Button onClick={() => setActionId(null)} variant="ghost">Cancel</Button>
                    <Button onClick={() => handleAction(req.id, 'deny')} disabled={!denyNote} variant="secondary">Confirm Deny</Button>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-end mt-4 border-t border-[hsl(220,15%,20%)] pt-4">
                    <Button onClick={() => handleAction(req.id, 'deny')} variant="secondary">Deny</Button>
                    <Button onClick={() => handleAction(req.id, 'approve')} className="bg-[hsl(0,72%,50%)] hover:bg-[hsl(0,72%,40%)] text-white">Approve Deletion</Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {requests.length === 0 && (
          <div className="p-12 text-center text-[hsl(220,10%,60%)] bg-[hsl(220,18%,12%)] rounded-xl border border-dashed border-[hsl(220,15%,20%)]">
            No pending delete requests
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# 6. exports/page.tsx
cat << 'EOF' > "src/app/(superadmin)/superadmin/exports/page.tsx"
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ExportsPage() {
  const [downloadingUsers, setDownloadingUsers] = useState(false);
  const [downloadingContent, setDownloadingContent] = useState(false);

  const handleDownload = async (type: 'users' | 'content') => {
    const setDownloading = type === 'users' ? setDownloadingUsers : setDownloadingContent;
    setDownloading(true);
    
    try {
      const res = await fetch(`/api/superadmin/export/${type}`);
      if (!res.ok) throw new Error('Export failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ousl_${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert('Failed to download export');
    }
    
    setDownloading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-serif text-[hsl(220,10%,92%)]">Data Exports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)] flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-[hsl(220,10%,92%)] mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Export Users
            </h3>
            <p className="text-sm text-[hsl(220,10%,60%)] mb-6 leading-relaxed">
              Download all user data as CSV. Includes: name, email, phone, study year, role, tutor status, and join date. Password data is never included for security reasons.
            </p>
          </div>
          <Button 
            onClick={() => handleDownload('users')} 
            disabled={downloadingUsers}
            className="w-full bg-[hsl(220,16%,16%)] border border-[hsl(220,15%,20%)] hover:bg-[hsl(220,18%,22%)]"
          >
            {downloadingUsers ? 'Preparing file...' : 'Download CSV'}
          </Button>
        </Card>

        <Card className="p-6 bg-[hsl(220,18%,12%)] border-[hsl(220,15%,20%)] flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-[hsl(220,10%,92%)] mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              Export Content & Judgements
            </h3>
            <p className="text-sm text-[hsl(220,10%,60%)] mb-6 leading-relaxed">
              Download all study content and judgement data as CSV. Includes: title, level, subject, creator information, status, URLs, and creation dates.
            </p>
          </div>
          <Button 
            onClick={() => handleDownload('content')} 
            disabled={downloadingContent}
            className="w-full bg-[hsl(220,16%,16%)] border border-[hsl(220,15%,20%)] hover:bg-[hsl(220,18%,22%)]"
          >
            {downloadingContent ? 'Preparing file...' : 'Download CSV'}
          </Button>
        </Card>
      </div>
      
      <p className="text-xs text-[hsl(220,10%,60%)] text-center mt-8">
        Note: Exported data contains PII (Personally Identifiable Information). Please handle these files according to institutional data privacy guidelines.
      </p>
    </div>
  );
}
EOF

# 7. dashboard api
cat << 'EOF' > src/app/api/superadmin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await requireRole(['SUPER_ADMIN']);
    
    const [
      totalStudents,
      totalTutors,
      totalContent,
      totalJudgements,
      pendingContent,
      pendingJudgements,
      pendingTutorApps,
      recentActivity
    ] = await Promise.all([
      db.user.count({ where: { role: 'STUDENT' } }),
      db.user.count({ where: { OR: [{ role: 'TUTOR' }, { tutorStatus: 'APPROVED' }] } }),
      db.content.count({ where: { status: 'APPROVED', deletedAt: null } }),
      db.judgement.count({ where: { status: 'APPROVED', deletedAt: null } }),
      db.content.count({ where: { status: 'PENDING_REVIEW', deletedAt: null } }),
      db.judgement.count({ where: { status: 'PENDING_REVIEW', deletedAt: null } }),
      db.user.count({ where: { tutorStatus: 'PENDING' } }),
      db.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return NextResponse.json({
      totalStudents,
      totalTutors,
      totalContent,
      totalJudgements,
      pendingApprovals: pendingContent + pendingJudgements,
      pendingTutorApps,
      recentActivity
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 });
  }
}
EOF

# 8. branding api
cat << 'EOF' > src/app/api/superadmin/branding/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';

export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await db.siteSettings.create({ data: { id: 1 } });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireRole(['SUPER_ADMIN']);
    const body = await req.json();
    
    const { logoUrl, homepageBackgroundUrls, homepageHeadline, homepageSubtext } = body;
    
    const settings = await db.siteSettings.upsert({
      where: { id: 1 },
      update: { logoUrl, homepageBackgroundUrls, homepageHeadline, homepageSubtext },
      create: { id: 1, logoUrl, homepageBackgroundUrls, homepageHeadline, homepageSubtext }
    });
    
    await logAudit(session.user.id, 'UPDATE_BRANDING', 'SiteSettings', '1', 'Updated site branding');
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 });
  }
}
EOF

# 9. upload api
cat << 'EOF' > src/app/api/superadmin/branding/upload/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    await requireRole(['SUPER_ADMIN']);
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch(e) {}
    
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 });
  }
}
EOF

# 10. admins api
cat << 'EOF' > src/app/api/superadmin/admins/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await requireRole(['SUPER_ADMIN']);
    const admins = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, fullName: true, email: true, phone: true, createdAt: true, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireRole(['SUPER_ADMIN']);
    const { fullName, email, phone } = await req.json();
    
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    
    const user = await db.user.create({
      data: {
        fullName,
        email,
        phone,
        role: 'ADMIN',
        emailVerified: true,
        passwordHash
      }
    });
    
    await logAudit(session.user.id, 'CREATE_ADMIN', 'User', user.id, `Created admin account for ${email}`);
    
    // In production, send invite email with reset link here
    
    return NextResponse.json({ message: 'Admin account created', id: user.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 });
  }
}
EOF

# 11. admins delete api
cat << 'EOF' > src/app/api/superadmin/admins/[id]/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(['SUPER_ADMIN']);
    const id = params.id;
    
    await db.user.update({
      where: { id },
      data: { isActive: false, role: 'STUDENT' }
    });
    
    await logAudit(session.user.id, 'REMOVE_ADMIN', 'User', id, 'Demoted admin to student and deactivated');
    
    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 });
  }
}
EOF

# 12. delete-approvals get
cat << 'EOF' > src/app/api/superadmin/delete-approvals/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await requireRole(['SUPER_ADMIN']);
    const requests = await db.deleteRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        requestedBy: { select: { fullName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const enriched = await Promise.all(requests.map(async (req) => {
      let details = null;
      if (req.contentType === 'CONTENT') {
        details = await db.content.findUnique({ where: { id: req.contentId }, select: { title: true } });
      } else if (req.contentType === 'JUDGEMENT') {
        details = await db.judgement.findUnique({ where: { id: req.contentId }, select: { title: true } });
      }
      return { ...req, contentDetails: details };
    }));
    
    return NextResponse.json(enriched);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
EOF

# 13. delete-approvals decide
cat << 'EOF' > src/app/api/superadmin/delete-approvals/[id]/decide/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(['SUPER_ADMIN']);
    const id = params.id;
    const { decision, note } = await req.json();
    
    const request = await db.deleteRequest.findUnique({ where: { id } });
    if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    if (decision === 'approve') {
      if (request.contentType === 'CONTENT') {
        await db.content.update({ where: { id: request.contentId }, data: { deletedAt: new Date() } });
      } else {
        await db.judgement.update({ where: { id: request.contentId }, data: { deletedAt: new Date() } });
      }
      await db.deleteRequest.update({
        where: { id },
        data: { status: 'APPROVED', decidedById: session.user.id }
      });
      await logAudit(session.user.id, 'APPROVE_DELETE', request.contentType, request.contentId, 'Approved deletion request');
    } else if (decision === 'deny') {
      await db.deleteRequest.update({
        where: { id },
        data: { status: 'DENIED', decidedById: session.user.id, decisionNote: note }
      });
      await logAudit(session.user.id, 'DENY_DELETE', request.contentType, request.contentId, `Denied deletion request: ${note}`);
    }
    
    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 });
  }
}
EOF

# 14. export users
cat << 'EOF' > src/app/api/superadmin/export/users/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import Papa from 'papaparse';

export async function GET() {
  try {
    await requireRole(['SUPER_ADMIN']);
    
    const users = await db.user.findMany({
      select: {
        fullName: true,
        email: true,
        phone: true,
        studyYear: true,
        role: true,
        tutorStatus: true,
        emailVerified: true,
        isActive: true,
        createdAt: true
      }
    });
    
    const csv = Papa.unparse(users.map(u => ({
      ...u,
      createdAt: u.createdAt.toISOString()
    })));
    
    const date = new Date().toISOString().split('T')[0];
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="ousl_users_export_${date}.csv"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
EOF

# 15. export content
cat << 'EOF' > src/app/api/superadmin/export/content/route.ts
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { db } from '@/lib/db';
import Papa from 'papaparse';

export async function GET() {
  try {
    await requireRole(['SUPER_ADMIN']);
    
    const contents = await db.content.findMany({
      include: { creator: { select: { fullName: true } } }
    });
    
    const judgements = await db.judgement.findMany({
      include: { creator: { select: { fullName: true } } }
    });
    
    const rows = [
      ...contents.map(c => ({
        Type: 'Study Content',
        Title: c.title,
        'Case No': '',
        Level: c.level,
        Subject: c.subject,
        'Video URL': c.videoUrl || '',
        'Document URLs': (c.documentUrls as string[])?.join(', ') || '',
        Status: c.status,
        Creator: c.creator.fullName,
        Created: c.createdAt.toISOString()
      })),
      ...judgements.map(j => ({
        Type: 'Judgement',
        Title: j.title,
        'Case No': j.caseNumber || '',
        Level: j.level,
        Subject: j.subject,
        'Video URL': j.videoUrl || '',
        'Document URLs': (j.documentUrls as string[])?.join(', ') || '',
        Status: j.status,
        Creator: j.creator.fullName,
        Created: j.createdAt.toISOString()
      }))
    ];
    
    const csv = Papa.unparse(rows);
    
    const date = new Date().toISOString().split('T')[0];
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="ousl_content_export_${date}.csv"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
EOF

chmod +x setup_superadmin.sh
./setup_superadmin.sh
