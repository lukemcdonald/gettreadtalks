/**
 * Utility functions for data seeding
 */

/**
 * Generate URL-safe slug from text
 */
export function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Pick a random item from an array
 */
export function randomItem<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick N random unique items from an array
 */
export function randomSubset<T>(array: Array<T>, count: number): Array<T> {
  const shuffled = [...array].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate a random number based on weighted probabilities
 * @param weights - Array of weights (probabilities) that sum to 100
 * @returns Index of the selected weight
 *
 * @example
 * // 70% chance of 0, 20% chance of 1, 10% chance of 2
 * const index = weightedRandom([70, 20, 10]);
 */
export function weightedRandom(weights: Array<number>): number {
  const random = Math.random() * 100;
  let sum = 0;

  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random <= sum) {
      return i;
    }
  }

  return weights.length - 1;
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random boolean with given probability (0-1)
 */
export function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}
