'use client';

import type { User } from '@/services/auth/types';
import type { ReactNode } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

import {
  identify,
  loadAnalytics,
  reset,
  trackLocationChange,
} from '@/services/analytics';

function AnalyticsPageViews() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const previousLocationRef = useRef<{ path: string; search: string } | null>(
    null
  );

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const current = { path: pathname, search };
    const previous = previousLocationRef.current;
    previousLocationRef.current = current;
    trackLocationChange(previous, current);
  }, [pathname, search]);

  return null;
}

export function AnalyticsIdentifyUser({ user }: { user: User | null }) {
  const { _id: userId, email, name, role } = user ?? {};

  useEffect(() => {
    if (userId) {
      void identify(userId, { email, name, role });

      return;
    }

    void reset();
  }, [email, name, role, userId]);

  return null;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
      {children}
    </>
  );
}
