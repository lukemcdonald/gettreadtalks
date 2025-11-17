import type { Id } from '../../_generated/dataModel';
import type { StatusType } from '../../lib/types';

import { faker } from '@faker-js/faker';

import { slugify } from '../../lib/utils';
import { talkTitles } from '../data/talks';
import { randomBoolean, randomInt, randomItem, weightedRandom } from '../utils';

type Clip = {
  description?: string;
  mediaUrl: string;
  publishedAt?: number;
  slug: string;
  speakerId?: Id<'speakers'>;
  status: StatusType;
  talkId?: Id<'talks'>;
  title: string;
};

/**
 * Generate clip data with realistic distribution
 */
export function generateClips(count: number, talkIds: Id<'talks'>[], speakerIds: Id<'speakers'>[]) {
  const clips: Clip[] = [];

  // Generate clip titles by combining talk titles with descriptors
  const clipDescriptors = [
    'Key Moments from',
    'Highlights from',
    'The Best of',
    'Powerful Insights from',
    'Essential Teachings from',
    'Core Message of',
  ];

  for (let i = 0; i < count; i++) {
    // 80% of clips have a parent talk
    const hasTalk = randomBoolean(0.8);
    const talkId = hasTalk ? randomItem(talkIds) : undefined;

    // Generate title
    let title: string;
    if (hasTalk && randomBoolean(0.5)) {
      // Use descriptor + partial talk title
      const descriptor = randomItem(clipDescriptors);
      const baseTalkTitle = randomItem(talkTitles);
      title = `${descriptor} "${baseTalkTitle}"`;
    } else {
      // Use a short variation of a talk title
      const baseTalkTitle = randomItem(talkTitles);
      const words = baseTalkTitle.split(' ');
      const shortTitle = words.slice(0, randomInt(3, 6)).join(' ');
      title = shortTitle;
    }

    // Status distribution: 70% published, 20% approved, 10% backlog/archived
    const statusIndex = weightedRandom([70, 20, 10]);
    const statuses: StatusType[] = ['published', 'approved', 'backlog'];
    const status = statuses[statusIndex];

    // Generate published date for published clips
    const now = Date.now();
    const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000;
    let publishedAt: number | undefined;

    if (status === 'published') {
      publishedAt = faker.date.between({ from: twoYearsAgo, to: now }).getTime();
    }

    const clip: Clip = {
      mediaUrl: `${faker.internet.url()}/clip.mp4`,
      publishedAt,
      slug: slugify(title),
      status,
      talkId,
      title,
    };

    // 70% have descriptions
    if (randomBoolean(0.7)) {
      clip.description = faker.lorem.paragraph();
    }

    // Clips with talks don't need speaker ID (inherited from talk)
    // Standalone clips (no talk) get random speaker
    if (!talkId) {
      clip.speakerId = randomItem(speakerIds);
    }

    clips.push(clip);
  }

  return clips;
}
