'use client';

import type { EventMap } from './events';

import { captureEvent } from './client';

export function track<E extends keyof EventMap>(
  event: E,
  ...args: EventMap[E] extends Record<string, never> ? [] : [EventMap[E]]
) {
  const [properties] = args;

  void captureEvent(event, properties as Record<string, unknown> | undefined);
}
