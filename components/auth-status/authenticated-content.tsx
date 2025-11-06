'use client';

import type { AuthUser } from '@/lib/services/auth/types';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import LogoutButton from './logout-button';

interface AuthenticatedContentProps {
  user: AuthUser;
}

export function AuthenticatedContent({ user }: AuthenticatedContentProps) {
  return (
    <div className="inline-flex items-center space-x-4">
      <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
        {user.name || 'User'}
      </div>
      <div className="space-x-2">
        <Button render={<Link href="/account">Account</Link>} />
        <LogoutButton />
      </div>
    </div>
  );
}
