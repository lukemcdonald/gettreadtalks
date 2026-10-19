import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { listPublishedTalksForTopics, searchPublishedTalks } from './helpers';

describe('searchPublishedTalks', () => {
  it('returns published title matches and omits unpublished ones', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const talks = await t.query(
      async (ctx) => await searchPublishedTalks(ctx, 'Grace', 10)
    );

    expect(talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
  });
});

describe('listPublishedTalksForTopics', () => {
  it('returns other published talks on the same topics and excludes listed ids', async () => {
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

    await t.run(async (ctx) => {
      const relatedTalkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2024-07-01T12:00:00.000Z'),
        slug: 'related-grace',
        speakerId,
        status: 'published',
        title: 'Related Grace',
      });
      const draftTalkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        slug: 'draft-related-grace',
        speakerId,
        status: 'backlog',
        title: 'Draft Related Grace',
      });

      await ctx.db.insert('talksOnTopics', {
        talkId: relatedTalkId,
        topicId,
      });
      await ctx.db.insert('talksOnTopics', {
        talkId: draftTalkId,
        topicId,
      });
    });

    const talks = await t.query(
      async (ctx) =>
        await listPublishedTalksForTopics(ctx, [topicId], {
          excludeTalkIds: [currentTalkId],
        })
    );

    expect(talks.map((talk) => talk.slug)).toEqual(['related-grace']);
  });
});
