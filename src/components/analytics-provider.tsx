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

interface AnalyticsLocation {
  path: string;
  search: string;
}

function appendUniqueLocation(
  locations: AnalyticsLocation[],
  location: AnalyticsLocation
) {
  const last = locations.at(-1);

  if (last && last.path === location.path && last.search === location.search) {
    return locations;
  }

  return [...locations, location];
}

function AnalyticsLifecycle() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const { data: user, isLoading } = useCurrentUser();
  const { _id: userId, email, name, role } = user ?? {};
  const pendingLocationsRef = useRef<AnalyticsLocation[]>([]);
  const previousLocationRef = useRef<AnalyticsLocation | null>(null);

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
    if (!pathname) {
      return;
    }

    const current = { path: pathname, search };

    if (isLoading) {
      pendingLocationsRef.current = appendUniqueLocation(
        pendingLocationsRef.current,
        current
      );

      return;
    }

    const locations = appendUniqueLocation(
      pendingLocationsRef.current,
      current
    );
    pendingLocationsRef.current = [];

    let previous = previousLocationRef.current;

    for (const location of locations) {
      trackLocationChange(previous, location);
      previous = location;
    }

    previousLocationRef.current = previous;
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
