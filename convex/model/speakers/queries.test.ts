import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';
import { insertClip } from '../clips/test.factory';
import { insertTalk } from '../talks/test.factory';
import { insertTalkOnTopic, insertTopic } from '../topics/test.factory';
import { insertSpeaker } from './test.factory';

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

  it('omits clips whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speaker = await t.query(api.speakers.getSpeakerBySlug, {
      slug: visibilitySlugs.publishedSpeaker,
    });

    expect(speaker?.clips.map((clip) => clip.slug).toSorted()).toEqual([
      visibilitySlugs.clipOnPublishedTalk,
      visibilitySlugs.standaloneClip,
    ]);
  });
});

describe('listFeaturedSpeakers', () => {
  it('keeps scanning past featured speakers with no public content', async () => {
    const t = createConvexTest();

    await t.run(async (ctx) => {
      for (let index = 0; index < 51; index += 1) {
        // oxlint-disable-next-line no-await-in-loop -- featured index order follows insert order
        const speakerId = await insertSpeaker(ctx, {
          featured: true,
          firstName: 'Hidden',
          lastName: `Speaker ${index}`,
          slug: `hidden-featured-${index}`,
        });
        // oxlint-disable-next-line no-await-in-loop -- featured index order follows insert order
        const talkId = await insertTalk(ctx, {
          slug: `hidden-featured-talk-${index}`,
          speakerId,
          status: 'backlog',
          title: `Hidden Featured Talk ${index}`,
        });

        // oxlint-disable-next-line no-await-in-loop -- featured index order follows insert order
        await insertClip(ctx, {
          slug: `hidden-featured-clip-${index}`,
          speakerId,
          talkId,
          title: `Hidden Featured Clip ${index}`,
        });
      }

      const standaloneId = await insertSpeaker(ctx, {
        featured: true,
        firstName: 'Standalone',
        lastName: 'Featured',
        slug: 'standalone-featured',
      });
      const visibleId = await insertSpeaker(ctx, {
        featured: true,
        firstName: 'Visible',
        lastName: 'Featured',
        slug: 'visible-featured',
      });

      await insertClip(ctx, {
        slug: 'standalone-featured-clip',
        speakerId: standaloneId,
        title: 'Standalone Featured Clip',
      });
      await insertTalk(ctx, {
        slug: 'visible-featured-talk',
        speakerId: visibleId,
        title: 'Visible Featured Talk',
      });
    });

    const speakers = await t.query(api.speakers.listFeaturedSpeakers, {
      limit: 6,
    });
    const slugs = speakers.map((speaker) => speaker.slug);

    expect(slugs).toContain('standalone-featured');
    expect(slugs).toContain('visible-featured');
    expect(slugs).not.toContain('hidden-featured-0');
    expect(slugs).not.toContain('hidden-featured-50');
  });
});

describe('listAllSpeakers', () => {
  it('defaults to published and returns every speaker for all', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);
    const { asUser: asAdmin } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });
    const paginationOpts = { cursor: null, numItems: 20 };

    const published = await asAdmin.query(api.speakers.listAllSpeakers, {
      paginationOpts,
    });
    const all = await asAdmin.query(api.speakers.listAllSpeakers, {
      paginationOpts,
      status: 'all',
    });

    expect(published.page.map((item) => item.speaker.slug)).toEqual([
      visibilitySlugs.publishedSpeaker,
    ]);
    expect(all.page.map((item) => item.speaker.slug).toSorted()).toEqual([
      visibilitySlugs.draftSpeaker,
      visibilitySlugs.publishedSpeaker,
    ]);
  });
});
