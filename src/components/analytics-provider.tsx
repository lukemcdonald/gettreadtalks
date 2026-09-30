'use client';

import type { ReactNode } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { identify, loadAnalytics, page, reset } from '@/lib/analytics';

function AnalyticsLifecycle() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const locationKey = search ? `${pathname}?${search}` : pathname;
  const lastPage = useRef<string | null>(null);
  const { data: user, isLoading } = useCurrentUser();
  const { _id: userId, email, name, role } = user ?? {};

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
    if (isLoading || !locationKey || lastPage.current === locationKey) {
      return;
    }

    lastPage.current = locationKey;
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
