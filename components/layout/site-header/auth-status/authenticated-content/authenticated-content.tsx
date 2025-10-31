'use client';

import type { AuthUser } from '@/lib/services/auth/types';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge, Button } from '@/components/ui';
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
    <div className="inline-flex items-center gap-3">
      <Badge variant="success">{user.name || 'User'}</Badge>
      <div className="flex gap-2">
        <Link href="/account">
          <Button variant="primary" size="sm">
            Account
          </Button>
        </Link>
        <Button variant="error" size="sm" onClick={handleLogout} type="button">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default AuthenticatedContent;
