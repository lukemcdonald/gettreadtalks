import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('searchSite', () => {
  it('returns published title matches and omits unpublished ones', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const result = await t.query(api.search.searchSite, {
      query: 'Grace',
    });

    expect(result.talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
  });
});

describe('listTalksByTopics', () => {
  it('prefers recently tagged talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(published).not.toBeNull();

    const topicId = published?.topics[0]?._id;
    const currentTalkId = published?.talk._id;
    const speakerId = published?.talk.speakerId;

    expect(topicId).toBeDefined();
    expect(currentTalkId).toBeDefined();
    expect(speakerId).toBeDefined();

    if (!(topicId && currentTalkId && speakerId)) {
      throw new Error('expected a published talk with a topic');
    }

    const extraTalkCount = 26;
    const oldestSlug = 'related-grace-0';
    const newestSlug = `related-grace-${extraTalkCount - 1}`;

    await t.run(async (ctx) => {
      const indexes = Array.from(
        { length: extraTalkCount },
        (_, index) => index
      );

      for (const index of indexes) {
        // oxlint-disable-next-line no-await-in-loop -- join creation time must stay sequential
        const talkId = await ctx.db.insert('talks', {
          mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
          publishedAt: Date.parse('2024-07-01T12:00:00.000Z'),
          slug: `related-grace-${index}`,
          speakerId,
          status: 'published',
          title: `Related Grace ${index}`,
        });

        // oxlint-disable-next-line no-await-in-loop -- join creation time must stay sequential
        await ctx.db.insert('talksOnTopics', {
          talkId,
          topicId,
        });
      }
    });

    const talks = await t.query(api.talks.listTalksByTopics, {
      excludeTalkIds: [currentTalkId],
      limit: extraTalkCount,
      topicIds: [topicId],
    });
    const slugs = talks.map((talk) => talk.slug);

    expect(slugs).toContain(newestSlug);
    expect(slugs).not.toContain(oldestSlug);
  });
});
