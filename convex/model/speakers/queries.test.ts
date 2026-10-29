import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { insertTalk } from '../talks/test.factory';
import { insertTalkOnTopic, insertTopic } from '../topics/test.factory';

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
      const earlierTopicId = await insertTopic(ctx, {
        slug: 'another-topic',
        title: 'Another Topic',
      });
      const talkId = await insertTalk(ctx, {
        publishedAt: Date.parse('2024-07-01T12:00:00.000Z'),
        slug: 'another-published-talk',
        speakerId,
        title: 'Another Published Talk',
      });

      await insertTalkOnTopic(ctx, {
        talkId,
        topicId: earlierTopicId,
      });
      await insertTalkOnTopic(ctx, {
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

  it('lists talks newest-first by publishedAt', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });
    const speakerId = published?.talk.speakerId;

    expect(speakerId).toBeDefined();

    if (!speakerId) {
      throw new Error('expected a published talk');
    }

    await t.run(async (ctx) => {
      await insertTalk(ctx, {
        publishedAt: Date.parse('2020-01-01T12:00:00.000Z'),
        slug: 'older-speaker-talk',
        speakerId,
        title: 'Older Speaker Talk',
      });
    });

    const speaker = await t.query(api.speakers.getSpeakerBySlug, {
      slug: visibilitySlugs.publishedSpeaker,
    });

    expect(speaker?.talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
      'older-speaker-talk',
    ]);
  });
});
