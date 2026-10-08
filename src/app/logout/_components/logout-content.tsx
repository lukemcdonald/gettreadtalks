'use client';

import type { Route } from 'next';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { track, waitForAnalytics } from '@/services/analytics';
import { signOut } from '@/services/auth/client';
import { captureException } from '@/services/errors';

export function LogoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        await waitForAnalytics(track('signed_out'));
      } catch (error) {
        captureException(error, {
          fingerprint: ['auth', 'signOut'],
        });
      }

      router.push(redirectTo as Route);
    };

    handleLogout();
  }, [redirectTo, router]);

  return null;
}
