export type RotationPeriod = 'daily' | 'weekly' | 'hourly';

interface RotateContentOptions {
  count?: number;
  period?: RotationPeriod;
  seed?: number;
}

const LCG_INCREMENT = 1_013_904_223;
const LCG_MODULUS = 2 ** 32;
const LCG_MULTIPLIER = 1_664_525;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;

export function getRotationPeriodMs(period: RotationPeriod): number {
  switch (period) {
    case 'hourly': {
      return MS_PER_HOUR;
    }
    case 'weekly': {
      return MS_PER_WEEK;
    }
    default: {
      return MS_PER_DAY;
    }
  }
}

export function getTimeSeed(period: RotationPeriod, now = Date.now()): number {
  return Math.floor(now / getRotationPeriodMs(period));
}

export function secondsUntilNextRotation(
  period: RotationPeriod,
  now = Date.now()
): number {
  const interval = getRotationPeriodMs(period);
  const remainingMs = interval - (now % interval);

  return Math.max(1, Math.ceil(remainingMs / 1000));
}

export function getRotationCacheLife(
  period: RotationPeriod = 'daily',
  now = Date.now()
) {
  const expire = Math.max(2, secondsUntilNextRotation(period, now));

  return {
    expire,
    revalidate: expire - 1,
    stale: expire,
  };
}

function normalizeRotationSeed(seed: number) {
  if (!Number.isFinite(seed)) {
    return 0;
  }

  const wrapped = Math.trunc(seed) % LCG_MODULUS;

  if (wrapped < 0) {
    return wrapped + LCG_MODULUS;
  }

  return wrapped;
}

function getRotationSeed(period: RotationPeriod, seed: number | undefined) {
  if (seed === undefined || !Number.isFinite(seed)) {
    return getTimeSeed(period);
  }

  return seed;
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = normalizeRotationSeed(seed);

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    currentSeed = (LCG_MULTIPLIER * currentSeed + LCG_INCREMENT) % LCG_MODULUS;
    const j = Math.floor((currentSeed / LCG_MODULUS) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Deterministically rotate content based on time period.
 * Same results for all users within the time period.
 */
export function rotateContent<T>(
  items: T[],
  options: RotateContentOptions = {}
): T[] {
  const { count = 1, period = 'daily', seed } = options;

  if (items.length === 0 || count >= items.length) {
    return items.slice(0, count);
  }

  const shuffled = seededShuffle(items, getRotationSeed(period, seed));

  return shuffled.slice(0, count);
}
