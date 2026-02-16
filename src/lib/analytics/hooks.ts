'use client';

import type { EventMap, NoPayloadEvents, PayloadEvents } from './events';

import { usePostHog } from 'posthog-js/react';

function warnInDev(event: string, properties: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') return;

  for (const [key, value] of Object.entries(properties)) {
    if (value === '' || value === undefined || (typeof value === 'number' && isNaN(value))) {
      console.warn(`[analytics] "${event}.${key}" has a suspicious value:`, value);
    }
  }
}

export function useAnalytics() {
  const posthog = usePostHog();

  function track<E extends NoPayloadEvents>(event: E): void;
  function track<E extends PayloadEvents>(event: E, properties: EventMap[E]): void;
  function track<E extends keyof EventMap>(event: E, properties?: EventMap[E]) {
    if (properties) {
      warnInDev(event, properties as Record<string, unknown>);
    }
    posthog?.capture(event, properties as Record<string, unknown>);
  }

  return { track };
}
