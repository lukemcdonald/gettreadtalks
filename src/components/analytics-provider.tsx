'use client';

import type { ReactNode } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { analytics, loadAnalytics } from '@/lib/analytics/client';

function SegmentPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    void analytics.page({
      path: pathname,
      search: searchParams.toString(),
    });
  }, [pathname, searchParams]);

  return null;
}

function SegmentIdentify() {
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      void analytics.identify(user._id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return;
    }

    void analytics.reset();
  }, [isLoading, user]);

  return null;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;
    setIsEnabled(loadAnalytics());
  }, []);

  if (!isEnabled) {
    return children;
  }

  return (
    <>
      <Suspense fallback={null}>
        <SegmentPageView />
      </Suspense>
      <SegmentIdentify />
      {children}
    </>
  );
}
