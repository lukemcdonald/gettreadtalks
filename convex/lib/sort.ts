/**
 * Reusable comparator functions for sorting arrays.
 * Use with Array.sort() for consistent sorting across queries.
 */

type SortDirection = 'asc' | 'desc';

/**
 * Compare by title alphabetically.
 */
export function byTitle<T extends { title: string }>(a: T, b: T): number {
  return a.title.localeCompare(b.title);
}

/**
 * Compare by publishedAt timestamp.
 */
export function byPublishedAt<T extends { publishedAt?: number }>(
  a: T,
  b: T,
  direction: SortDirection = 'desc',
): number {
  const aTime = a.publishedAt || 0;
  const bTime = b.publishedAt || 0;
  return direction === 'desc' ? bTime - aTime : aTime - bTime;
}

/**
 * Compare by numeric count.
 */
export function byCount<T extends { count: number }>(
  a: T,
  b: T,
  direction: SortDirection = 'desc',
): number {
  return direction === 'desc' ? b.count - a.count : a.count - b.count;
}

/**
 * Content sort options (talks, clips).
 * - recent: newest first (default)
 * - oldest: oldest first
 * - alphabetical: A-Z by title
 * - featured: featured first, then by recent
 */
export type ContentSortOption = 'alphabetical' | 'featured' | 'oldest' | 'recent';

/**
 * Get comparator for content (talks, clips) based on sort option.
 */
export function getContentComparator<
  T extends { featured?: boolean; title: string; publishedAt?: number },
>(sort: ContentSortOption = 'recent'): (a: T, b: T) => number {
  switch (sort) {
    case 'alphabetical':
      return byTitle;
    case 'featured':
      return (a, b) => {
        if (a.featured && !b.featured) {
          return -1;
        }
        if (!a.featured && b.featured) {
          return 1;
        }
        return byPublishedAt(a, b, 'desc');
      };
    case 'oldest':
      return (a, b) => byPublishedAt(a, b, 'asc');
    default:
      return (a, b) => byPublishedAt(a, b, 'desc');
  }
}

/**
 * Topic sort options.
 * - alphabetical: A-Z by title (default)
 * - most-talks: highest count first
 * - least-talks: lowest count first
 */
export type TopicSortOption = 'alphabetical' | 'least-talks' | 'most-talks';

/**
 * Get comparator for topics with counts based on sort option.
 */
export function getTopicComparator<T extends { count: number; topic: { title: string } }>(
  sort: TopicSortOption = 'alphabetical',
): (a: T, b: T) => number {
  switch (sort) {
    case 'most-talks':
      return (a, b) => byCount(a, b, 'desc');
    case 'least-talks':
      return (a, b) => byCount(a, b, 'asc');
    default:
      return (a, b) => a.topic.title.localeCompare(b.topic.title);
  }
}

/**
 * Compare by lastName alphabetically.
 */
export function byLastName<T extends { lastName: string }>(a: T, b: T): number {
  return a.lastName.localeCompare(b.lastName);
}

/**
 * Speaker sort options.
 * - alphabetical: A-Z by lastName (default)
 * - featured: featured first, then alphabetical
 */
export type SpeakerSortOption = 'alphabetical' | 'featured';

/**
 * Get comparator for speakers based on sort option.
 */
export function getSpeakerComparator<T extends { featured?: boolean; lastName: string }>(
  sort: SpeakerSortOption = 'alphabetical',
): (a: T, b: T) => number {
  switch (sort) {
    case 'featured':
      return (a, b) => {
        if (a.featured && !b.featured) {
          return -1;
        }
        if (!a.featured && b.featured) {
          return 1;
        }
        return byLastName(a, b);
      };
    default:
      return byLastName;
  }
}
