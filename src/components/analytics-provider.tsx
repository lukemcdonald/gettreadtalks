'use client';

import type { ReactNode } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import {
  identify,
  loadAnalytics,
  reset,
  trackLocationChange,
} from '@/services/analytics';

function AnalyticsLifecycle() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const { data: user, isLoading } = useCurrentUser();
  const { _id: userId, email, name, role } = user ?? {};
  const previousLocationRef = useRef<{ path: string; search: string } | null>(
    null
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (userId) {
      void identify(userId, { email, name, role });

      return;
    }

    void reset();
  }, [email, isLoading, name, role, userId]);

  useEffect(() => {
    if (isLoading || !pathname) {
      return;
    }

    const current = { path: pathname, search };
    const previous = previousLocationRef.current;
    previousLocationRef.current = current;
    trackLocationChange(previous, current);
  }, [isLoading, pathname, search]);

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
