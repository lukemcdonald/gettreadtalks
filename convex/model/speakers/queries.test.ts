import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listSpeakerSlugs', () => {
  it('lists only speakers with published talks or clips', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speakers = await t.query(api.speakers.listSpeakerSlugs, {});
    const slugs = speakers.map((speaker) => speaker.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedSpeaker]);
    expect(slugs).not.toContain(visibilitySlugs.draftSpeaker);
  });
});

describe('getSpeakerBySlug', () => {
  it('lists unique topics from published talks, sorted by title', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });
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

    const speaker = await t.query(api.speakers.getSpeakerBySlug, {
      slug: visibilitySlugs.publishedSpeaker,
    });

    expect(speaker?.topics.map((topic) => topic.slug)).toEqual([
      'another-topic',
      visibilitySlugs.publishedTopic,
    ]);
    expect(speaker?.topics.map((topic) => topic.slug)).not.toContain(
      visibilitySlugs.unpublishedOnlyTopic
    );
  });

  it('hides topics when the speaker has no published talk topics', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speaker = await t.query(api.speakers.getSpeakerBySlug, {
      slug: visibilitySlugs.draftSpeaker,
    });

    expect(speaker?.topics).toEqual([]);
  });
});
