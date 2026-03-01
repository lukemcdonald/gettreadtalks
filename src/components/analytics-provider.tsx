'use client';

import type { ReactNode } from 'react';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';

function PostHogPageView() {
  const pathname = usePathname();
  const posthogClient = usePostHog();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!(pathname && posthogClient)) {
      return;
    }
    const url = searchParams.toString()
      ? `${window.origin}${pathname}?${searchParams}`
      : `${window.origin}${pathname}`;
    posthogClient.capture('$pageview', { $current_url: url });
  }, [pathname, posthogClient, searchParams]);

  return null;
}

function PostHogIdentify() {
  const { data: user, isLoading } = useCurrentUser();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (isLoading || !posthogClient) {
      return;
    }

    if (user) {
      posthogClient.identify(user._id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } else {
      posthogClient.reset();
    }
  }, [isLoading, posthogClient, user]);

  return null;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      return;
    }

    initialized.current = true;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      capture_pageleave: true,
      capture_pageview: false,
      session_recording: {
        maskAllInputs: true,
      },
      ui_host: 'https://us.posthog.com',
    });

    setIsReady(true);
  }, []);

  if (!isReady) {
    return children;
  }

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      <PostHogIdentify />
      {children}
    </PostHogProvider>
  );
}
