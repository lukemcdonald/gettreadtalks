import { topics } from '../data/topics';

/**
 * Generate topic data from curated list
 */
export function generateTopics() {
  return topics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
  }));
}
