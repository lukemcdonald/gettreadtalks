'use client';

import type { AuthUser } from '@/lib/services/auth/types';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { signOut } from '@/lib/services/auth/client';
import { captureException } from '@/lib/services/errors/client';

interface AuthenticatedContentProps {
  user: AuthUser;
}

function AuthenticatedContent({ user }: AuthenticatedContentProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.refresh();
    } catch (error) {
      captureException(error, {
        context: {
          operation: 'logout',
          userId: user._id,
        },
        fingerprint: ['auth', 'logout', 'client-error'],
        level: 'error',
        tags: {
          feature: 'auth',
          operation: 'logout',
        },
      });
    }
  };

  return (
    <div className="inline-flex items-center space-x-4">
      <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
        {user.name || 'User'}
      </div>
      <div className="space-x-2">
        <Link
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          href="/account"
        >
          Account
        </Link>
        <button
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={handleLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AuthenticatedContent;
