'use client';

import type { EventMap, NoPayloadEvents, PayloadEvents } from './events';

import { analytics, isAnalyticsLoaded } from './client';

function logInDev(event: string, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.log(`[analytics]: ${event}`, properties);

  if (properties) {
    for (const [key, value] of Object.entries(properties)) {
      if (
        value === '' ||
        value === undefined ||
        (typeof value === 'number' && Number.isNaN(value))
      ) {
        console.warn(
          `[analytics]: "${event}.${key}" has a suspicious value:`,
          value
        );
      }
    }
  }
}

export function useAnalytics() {
  const client = analytics;

  function track<E extends NoPayloadEvents>(event: E): void;
  function track<E extends PayloadEvents>(
    event: E,
    properties: EventMap[E]
  ): void;
  function track<E extends keyof EventMap>(event: E, properties?: EventMap[E]) {
    logInDev(event, properties as Record<string, unknown>);

    if (!isAnalyticsLoaded()) {
      return;
    }

    void client.track(event, properties as Record<string, unknown> | undefined);
  }

  return { track };
}
