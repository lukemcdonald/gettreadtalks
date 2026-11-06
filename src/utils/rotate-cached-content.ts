'use cache';

import type { RotationPeriod } from '@/convex/lib/rotateContent';

import { cacheLife } from 'next/cache';

import {
  getRotationCacheLife,
  getTimeSeed,
  rotateContent,
} from '@/convex/lib/rotateContent';

interface RotateCachedContentOptions {
  count?: number;
  period?: RotationPeriod;
}

/** Time-seeded rotation cached until the next period boundary. */
export async function rotateCachedContent<T>(
  items: T[],
  options: RotateCachedContentOptions = {}
) {
  const count = options.count ?? 1;
  const now = Date.now();
  const period = options.period ?? 'daily';

  cacheLife(getRotationCacheLife(period, now));

  return await rotateForBucket(items, count, getTimeSeed(period, now));
}

async function rotateForBucket<T>(items: T[], count: number, bucket: number) {
  'use cache';

  cacheLife('days');

  return await Promise.resolve(
    rotateContent(items, {
      count,
      seed: bucket,
    })
  );
}
