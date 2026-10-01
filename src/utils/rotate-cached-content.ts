'use cache';

import type { RotationPeriod } from '@/convex/lib/rotateContent';

import { cacheLife } from 'next/cache';

import { rotateContent } from '@/convex/lib/rotateContent';

interface RotateCachedContentOptions {
  count?: number;
  period?: RotationPeriod;
}

/** Time-seeded rotation cached to the rotation period so Date.now is prerender-safe. */
export async function rotateCachedContent<T>(
  items: T[],
  options: RotateCachedContentOptions = {}
) {
  const period = options.period ?? 'daily';

  switch (period) {
    case 'hourly': {
      cacheLife('hours');
      break;
    }
    case 'weekly': {
      cacheLife('weeks');
      break;
    }
    default: {
      cacheLife('days');
    }
  }

  return await Promise.resolve(rotateContent(items, options));
}
