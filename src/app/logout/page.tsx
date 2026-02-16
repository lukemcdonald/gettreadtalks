'use client';

import type { Route } from 'next';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAnalytics } from '@/lib/analytics';
import { signOut } from '@/services/auth/client';
import { captureException } from '@/services/errors/client';

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const { track } = useAnalytics();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        track('signed_out');
      } catch (error) {
        captureException(error, {
          fingerprint: ['auth', 'signOut'],
        });
      } finally {
        router.push(redirectTo as Route);
      }
    };

    handleLogout();
  }, [redirectTo, router, track]);

  return null;
}
