'use client';

import type { ReactNode } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { identify, loadAnalytics, page, reset } from '@/lib/analytics';

function AnalyticsLifecycle() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const { data: user, isLoading } = useCurrentUser();
  const locationKey = search ? `${pathname}?${search}` : pathname;
  const email = user?.email;
  const name = user?.name;
  const role = user?.role;
  const userId = user?._id;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (userId) {
      void identify(userId, {
        email,
        name,
        role,
      });

      return;
    }

    void reset();
  }, [email, isLoading, name, role, userId]);

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
