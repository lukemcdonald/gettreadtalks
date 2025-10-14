import { faker } from '@faker-js/faker';

import { normalizeSlug, randomBoolean } from '../utils';

/**
 * Collection themes for organizing talks
 */
const collectionThemes: Array<string> = [
  'Essential Teachings on Faith',
  'Leadership in Ministry',
  'Building Stronger Families',
  'Prayer and Spiritual Disciplines',
  'Living with Purpose',
  'Hope for Difficult Times',
  'Growing in Grace',
  'Wisdom for Daily Life',
  'The Power of Forgiveness',
  'Discovering Your Calling',
  'Foundations of the Christian Faith',
  'Marriage and Relationships',
];

/**
 * Generate collection data
 */
export function generateCollections(count: number = 8): Array<{
  description?: string;
  slug: string;
  title: string;
  url?: string;
}> {
  const collections: Array<{
    description?: string;
    slug: string;
    title: string;
    url?: string;
  }> = [];

  const shuffledThemes = [...collectionThemes].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, collectionThemes.length); i++) {
    const title = shuffledThemes[i];

    const collection: {
      description?: string;
      slug: string;
      title: string;
      url?: string;
    } = {
      slug: normalizeSlug(title),
      title,
    };

    // 90% have descriptions
    if (randomBoolean(0.9)) {
      collection.description = faker.lorem.sentences(3);
    }

    // 30% have external URLs
    if (randomBoolean(0.3)) {
      collection.url = faker.internet.url();
    }

    collections.push(collection);
  }

  return collections;
}
