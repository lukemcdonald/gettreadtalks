import { faker } from '@faker-js/faker';

import { ministryOrganizations, ministryRoles } from '../data/ministries';
import { speakers as realSpeakers } from '../data/speakers';
import { randomBoolean, randomItem } from '../utils';

type Speaker = {
  description?: string;
  featured?: boolean;
  firstName: string;
  imageUrl?: string;
  lastName: string;
  ministry?: string;
  role?: string;
  slug: string;
  websiteUrl?: string;
};

/**
 * Generate speaker data using real speaker names with varied realistic details
 */
export function generateSpeakers() {
  const speakers: Speaker[] = [];

  // Use real speaker names from the actual site
  for (const realSpeaker of realSpeakers) {
    const speaker: {
      description?: string;
      featured?: boolean;
      firstName: string;
      imageUrl?: string;
      lastName: string;
      ministry?: string;
      role?: string;
      slug: string;
      websiteUrl?: string;
    } = {
      firstName: realSpeaker.firstName,
      lastName: realSpeaker.lastName,
      slug: realSpeaker.slug,
    };

    // 10% chance to be featured
    if (randomBoolean(0.1)) {
      speaker.featured = true;
    }

    // 80% have descriptions
    if (randomBoolean(0.8)) {
      speaker.description = faker.person.bio();
    }

    // 60% have profile images
    if (randomBoolean(0.6)) {
      speaker.imageUrl = faker.image.avatar();
    }

    // 70% have ministry affiliation
    if (randomBoolean(0.7)) {
      speaker.ministry = randomItem(ministryOrganizations);
    }

    // 75% have a role
    if (randomBoolean(0.75)) {
      speaker.role = randomItem(ministryRoles);
    }

    // 40% have website URLs
    if (randomBoolean(0.4)) {
      speaker.websiteUrl = faker.internet.url();
    }

    speakers.push(speaker);
  }

  return speakers;
}
