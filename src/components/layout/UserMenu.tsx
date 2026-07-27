'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Dropdown from '@/components/ui/Dropdown';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { signOut } from 'next-auth/react';

interface User {
  id: string;
  fullName?: string | null;
  role?: string;
  studyYear?: number;
  tutorStatus?: string;
}

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
          <Avatar name={user.fullName || 'User'} size="sm" />
        </button>
      }
      align="end"
      className="w-64"
    >
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-[10px] py-0">{user.role}</Badge>
          <span className="text-xs text-text-secondary">Year {user.studyYear}</span>
        </div>
      </div>
      
      <div className="py-1">
        <Dropdown.Item onClick={() => router.push('/profile')}>
          My Profile
        </Dropdown.Item>
        
        {user.tutorStatus === 'NONE' && (
          <Dropdown.Item onClick={() => router.push('/apply-tutor')}>
            Apply to become a tutor
          </Dropdown.Item>
        )}
        
        {user.role === 'TUTOR' && (
          <Dropdown.Item onClick={() => router.push('/tutor')}>
            Tutor Dashboard
          </Dropdown.Item>
        )}

        {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
          <Dropdown.Item onClick={() => router.push('/admin')}>
            Admin Panel
          </Dropdown.Item>
        )}
      </div>

      <div className="border-t border-border py-1">
        <Dropdown.Item 
          onClick={handleLogout}
          className="text-error hover:bg-error/10 hover:text-error"
        >
          Logout
        </Dropdown.Item>
      </div>
    </Dropdown>
  );
}
