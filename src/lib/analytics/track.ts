'use client';

import type { EventMap } from './events';

import { captureEvent } from './client';

function logInDev(event: string, properties?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.log(`[analytics]: ${event}`, properties);
}

export function track<E extends keyof EventMap>(
  event: E,
  ...args: EventMap[E] extends Record<string, never> ? [] : [EventMap[E]]
) {
  const [properties] = args;
  logInDev(event, properties as Record<string, unknown> | undefined);
  void captureEvent(event, properties as Record<string, unknown> | undefined);
}
