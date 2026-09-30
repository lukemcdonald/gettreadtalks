'use client';

import type { ReactNode } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { identify, loadAnalytics, page, reset } from '@/lib/analytics';

function AnalyticsLifecycle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationKey = pathname ? `${pathname}?${searchParams.toString()}` : '';
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      void identify(user._id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return;
    }

    void reset();
  }, [isLoading, user]);

  useEffect(() => {
    if (isLoading || !locationKey) {
      return;
    }

    void page();
  }, [isLoading, locationKey]);

  return null;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsLifecycle />
      </Suspense>
      {children}
    </>
  );
}
