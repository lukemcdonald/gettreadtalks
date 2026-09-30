'use client';

import { AnalyticsBrowser } from '@segment/analytics-next';

export const analytics = new AnalyticsBrowser();

let loaded = false;

export function isAnalyticsLoaded() {
  return loaded;
}

export function loadAnalytics() {
  if (loaded) {
    return true;
  }

  const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

  if (!writeKey) {
    return false;
  }

  analytics.load({ writeKey });
  loaded = true;

  return true;
}
