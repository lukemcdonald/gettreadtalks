import type { Id } from '../../_generated/dataModel';
import type { StatusType } from '../../lib/types';

import { faker } from '@faker-js/faker';

import { scriptureReferences } from '../data/scripture_refs';
import { talkTitles } from '../data/talk_titles';
import { normalizeSlug, randomBoolean, randomInt, randomItem, weightedRandom } from '../utils';

/**
 * Generate talk data with realistic distribution
 */
export function generateTalks(
  count: number,
  speakerIds: Array<Id<'speakers'>>,
): Array<{
  description?: string;
  featured?: boolean;
  mediaUrl: string;
  publishedAt?: number;
  scripture?: string;
  slug: string;
  speakerId: Id<'speakers'>;
  status: StatusType;
  title: string;
}> {
  const talks: Array<{
    description?: string;
    featured?: boolean;
    mediaUrl: string;
    publishedAt?: number;
    scripture?: string;
    slug: string;
    speakerId: Id<'speakers'>;
    status: StatusType;
    title: string;
  }> = [];

  // Distribute talks unevenly across speakers (some have more than others)
  const talkDistribution = distributeTalksAcrossSpeakers(count, speakerIds.length);

  let titleIndex = 0;
  const shuffledTitles = [...talkTitles].sort(() => Math.random() - 0.5);

  speakerIds.forEach((speakerId, speakerIndex) => {
    const talksForThisSpeaker = talkDistribution[speakerIndex];

    for (let i = 0; i < talksForThisSpeaker; i++) {
      // Use curated titles, cycling through if we run out
      const title = shuffledTitles[titleIndex % shuffledTitles.length];
      titleIndex++;

      // Status distribution: 70% published, 20% approved, 10% backlog/archived
      const statusIndex = weightedRandom([70, 20, 10]);
      const statuses: Array<StatusType> = ['published', 'approved', 'backlog'];
      const status = statuses[statusIndex];

      // Generate published date for published talks (spread over past 2 years)
      const now = Date.now();
      const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000;
      let publishedAt: number | undefined;

      if (status === 'published') {
        // Featured talks tend to be more recent
        const isFeatured = randomBoolean(0.05);
        if (isFeatured) {
          // Featured: within last 6 months
          publishedAt = now - randomInt(0, 180) * 24 * 60 * 60 * 1000;
        } else {
          // Non-featured: spread over 2 years
          publishedAt = faker.date.between({ from: twoYearsAgo, to: now }).getTime();
        }
      }

      const talk: {
        description?: string;
        featured?: boolean;
        mediaUrl: string;
        publishedAt?: number;
        scripture?: string;
        slug: string;
        speakerId: Id<'speakers'>;
        status: StatusType;
        title: string;
      } = {
        mediaUrl: `${faker.internet.url()}/video.mp4`,
        publishedAt,
        slug: normalizeSlug(title),
        speakerId,
        status,
        title,
      };

      // 85% have descriptions
      if (randomBoolean(0.85)) {
        talk.description = faker.lorem.paragraphs(2);
      }

      // 60% have scripture references
      if (randomBoolean(0.6)) {
        talk.scripture = randomItem(scriptureReferences);
      }

      // 5% are featured (only if published)
      if (status === 'published' && randomBoolean(0.05)) {
        talk.featured = true;
      }

      talks.push(talk);
    }
  });

  return talks;
}

/**
 * Distribute talks unevenly across speakers
 * Some speakers (featured) get more talks, others get 1-3
 */
function distributeTalksAcrossSpeakers(totalTalks: number, speakerCount: number): Array<number> {
  const distribution = new Array(speakerCount).fill(0);

  // Give each speaker at least 1 talk
  for (let i = 0; i < speakerCount; i++) {
    distribution[i] = 1;
  }

  let remainingTalks = totalTalks - speakerCount;

  // Distribute remaining talks with weighted randomness
  // 10% of speakers are "featured" and get more talks
  const featuredSpeakerCount = Math.floor(speakerCount * 0.1);

  while (remainingTalks > 0) {
    const speakerIndex = Math.floor(Math.random() * speakerCount);

    // Featured speakers (first 10%) have higher chance of getting more talks
    if (speakerIndex < featuredSpeakerCount) {
      // Featured speakers can have up to 10 talks
      if (distribution[speakerIndex] < 10) {
        distribution[speakerIndex]++;
        remainingTalks--;
      }
    } else {
      // Regular speakers can have up to 5 talks
      if (distribution[speakerIndex] < 5) {
        distribution[speakerIndex]++;
        remainingTalks--;
      }
    }
  }

  return distribution;
}
