'use client';

import type { EventMap, NoPayloadEvents, PayloadEvents } from './events';

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
  const log = logInDev;

  function track<E extends NoPayloadEvents>(event: E): void;
  function track<E extends PayloadEvents>(
    event: E,
    properties: EventMap[E]
  ): void;
  function track<E extends keyof EventMap>(event: E, properties?: EventMap[E]) {
    log(event, properties as Record<string, unknown>);
  }

  return { track };
}
