import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listTalkSlugs', () => {
  it('lists only published talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const talks = await t.query(api.talks.listTalkSlugs, {});

    expect(talks).toEqual([
      expect.objectContaining({
        speakerSlug: visibilitySlugs.publishedSpeaker,
        talkSlug: visibilitySlugs.publishedTalk,
      }),
    ]);
  });
});

describe('getTalkBySlug', () => {
  it('returns a published talk and hides an unpublished one', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });
    const unpublished = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.draftTalk,
    });

    expect(published?.talk.slug).toBe(visibilitySlugs.publishedTalk);
    expect(unpublished).toBeNull();
  });
});

describe('listTalksByTopics', () => {
  it('returns up to 4 published talks sharing a topic and omits excluded talks', async () => {
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

    const sameSpeakerTalkId = await t.run(async (ctx) => {
      const otherSpeakerId = await ctx.db.insert('speakers', {
        firstName: 'Charles',
        lastName: 'Spurgeon',
        slug: 'charles-spurgeon',
      });

      await Promise.all(
        [1, 2, 3, 4, 5].map(async (index) => {
          const talkId = await ctx.db.insert('talks', {
            mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
            publishedAt: Date.parse(`2024-08-0${index}T12:00:00.000Z`),
            slug: `related-talk-${index}`,
            speakerId: otherSpeakerId,
            status: 'published',
            title: `Related Talk ${index}`,
          });

          await ctx.db.insert('talksOnTopics', {
            talkId,
            topicId,
          });
        })
      );

      const extraTalkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2024-08-06T12:00:00.000Z'),
        slug: 'same-speaker-related',
        speakerId,
        status: 'published',
        title: 'Same Speaker Related',
      });
      await ctx.db.insert('talksOnTopics', {
        talkId: extraTalkId,
        topicId,
      });

      const draftTalkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        slug: 'draft-same-topic',
        speakerId: otherSpeakerId,
        status: 'backlog',
        title: 'Draft Same Topic',
      });
      await ctx.db.insert('talksOnTopics', {
        talkId: draftTalkId,
        topicId,
      });

      return extraTalkId;
    });

    const talks = await t.query(api.talks.listTalksByTopics, {
      excludeTalkIds: [currentTalkId, sameSpeakerTalkId],
      limit: 4,
      topicIds: [topicId],
    });
    const slugs = talks.map((talk) => talk.slug);

    expect(talks).toHaveLength(4);
    expect(slugs).not.toContain(visibilitySlugs.publishedTalk);
    expect(slugs).not.toContain('same-speaker-related');
    expect(slugs).not.toContain('draft-same-topic');
    expect(talks.every((talk) => talk.status === 'published')).toBe(true);
    expect(
      talks.every((talk) => talk.speaker?.slug === 'charles-spurgeon')
    ).toBe(true);
  });

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
