export type RotationPeriod = 'daily' | 'weekly' | 'hourly';

interface RotateContentOptions {
  period?: RotationPeriod;
  count?: number;
}

function getTimeSeed(period: RotationPeriod): number {
  const now = Date.now();
  const MS_PER_HOUR = 1000 * 60 * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_WEEK = MS_PER_DAY * 7;

  switch (period) {
    case 'hourly':
      return Math.floor(now / MS_PER_HOUR);
    case 'daily':
      return Math.floor(now / MS_PER_DAY);
    case 'weekly':
      return Math.floor(now / MS_PER_WEEK);
    default:
      throw new Error(`Invalid rotation period: ${period}`);
  }
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;

  // Linear Congruential Generator
  const a = 1_664_525;
  const c = 1_013_904_223;
  const m = 2 ** 32;

  for (let i = shuffled.length - 1; i > 0; i--) {
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
export function rotateContent<T>(items: T[], options: RotateContentOptions = {}): T[] {
  const { period = 'daily', count = 1 } = options;

  if (items.length === 0 || count >= items.length) {
    return items.slice(0, count);
  }

  const seed = getTimeSeed(period);
  const shuffled = seededShuffle(items, seed);

  return shuffled.slice(0, count);
}
