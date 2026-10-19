import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { listPublishedTopicsForSpeaker } from './helpers';

describe('listPublishedTopicsForSpeaker', () => {
  it('returns unique topics from published talks, sorted by title', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(published).not.toBeNull();

    const speakerId = published?.talk.speakerId;
    const existingTopicId = published?.topics[0]?._id;

    expect(speakerId).toBeDefined();
    expect(existingTopicId).toBeDefined();

    if (!(speakerId && existingTopicId)) {
      throw new Error('expected a published talk with a topic');
    }

    await t.run(async (ctx) => {
      const earlierTopicId = await ctx.db.insert('topics', {
        slug: 'another-topic',
        title: 'Another Topic',
      });
      const talkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2024-07-01T12:00:00.000Z'),
        slug: 'another-published-talk',
        speakerId,
        status: 'published',
        title: 'Another Published Talk',
      });

      await ctx.db.insert('talksOnTopics', {
        talkId,
        topicId: earlierTopicId,
      });
      await ctx.db.insert('talksOnTopics', {
        talkId,
        topicId: existingTopicId,
      });
    });

    const topics = await t.query(
      async (ctx) => await listPublishedTopicsForSpeaker(ctx, speakerId)
    );

    expect(topics.map((topic) => topic.slug)).toEqual([
      'another-topic',
      visibilitySlugs.publishedTopic,
    ]);
  });
});
