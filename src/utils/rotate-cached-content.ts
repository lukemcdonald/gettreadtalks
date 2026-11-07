'use cache';

import type { RotationPeriod } from '@/convex/lib/rotateContent';

import { cacheLife } from 'next/cache';

import {
  getTimeSeed,
  rotateContent,
  secondsUntilNextRotation,
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
  const period = options.period ?? 'daily';
  const expire = secondsUntilNextRotation(period);

  cacheLife({
    expire,
    revalidate: expire,
    stale: expire,
  });

  return await rotateForBucket(items, count, getTimeSeed(period));
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
