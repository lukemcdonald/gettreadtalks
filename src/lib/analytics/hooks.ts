'use client';

import { track } from './track';

export function useAnalytics() {
  return { track };
}
