export type RotationPeriod = 'daily' | 'weekly' | 'hourly';

interface RotateContentOptions {
  count?: number;
  period?: RotationPeriod;
  seed?: number;
}

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

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;

  // Linear Congruential Generator
  const a = 1_664_525;
  const c = 1_013_904_223;
  const m = 2 ** 32;

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    currentSeed = (a * currentSeed + c) % m;
    const j = Math.floor((currentSeed / m) * (i + 1));
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

  const resolvedSeed = seed ?? getTimeSeed(period);
  const shuffled = seededShuffle(items, resolvedSeed);

  return shuffled.slice(0, count);
}
