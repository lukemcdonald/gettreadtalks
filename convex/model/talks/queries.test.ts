import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
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

  it('does not expose private transcript or study draft text', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(published).not.toBeNull();

    if (!published) {
      throw new Error('expected a published talk');
    }

    const draftSecret = 'PRIVATE_STUDY_DRAFT_SENTINEL_volt332';
    const transcriptSecret = 'PRIVATE_TRANSCRIPT_SENTINEL_volt332';

    await t.mutation(internal.talks.upsertTalkTranscript, {
      quality: 'good',
      source: 'speaker_published',
      status: 'done',
      talkId: published.talk._id,
      text: transcriptSecret,
      wordCount: 3,
    });
    await t.mutation(internal.talks.saveTalkStudyDraft, {
      generator: 'test',
      outline: [{ heading: 'Grace', text: draftSecret }],
      scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
      studyGuide: [{ kind: 'key_idea', text: draftSecret }],
      suggestedTopics: ['grace'],
      summary: draftSecret,
      talkId: published.talk._id,
    });

    const bySpeaker = await t.query(api.talks.listTalksBySpeaker, {
      speakerId: published.talk.speakerId,
    });
    const featured = await t.query(api.talks.listFeaturedTalksWithSpeakers, {});
    const listed = await t.query(api.talks.listTalks, {
      paginationOpts: { cursor: null, numItems: 50 },
    });
    const related = await t.query(api.talks.listTalksByTopics, {
      topicIds: published.topics.map((topic) => topic._id),
    });
    const search = await t.query(api.search.searchSite, { query: 'Grace' });
    const slugs = await t.query(api.talks.listTalkSlugs, {});
    const talk = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });
    const payload = JSON.stringify({
      bySpeaker,
      featured,
      listed,
      related,
      search,
      slugs,
      talk,
    });

    expect(payload).not.toContain(draftSecret);
    expect(payload).not.toContain(transcriptSecret);
  });

  it('returns a published study summary and never returns a draft', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(published).not.toBeNull();

    if (!published) {
      throw new Error('expected a published talk');
    }

    const draftSummary = 'DRAFT_STUDY_SUMMARY_MUST_STAY_PRIVATE';
    const publishedSummary = 'Published study summary for the talk page.';

    await t.run(async (ctx) => {
      await ctx.db.insert('talkStudies', {
        generatedAt: Date.now(),
        generator: 'test',
        outline: [],
        scriptureRefs: [],
        studyGuide: [],
        studyStatus: 'draft',
        suggestedTopics: [],
        summary: draftSummary,
        talkId: published.talk._id,
      });
    });

    const withDraft = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(withDraft?.summary).toBeNull();
    expect(JSON.stringify(withDraft)).not.toContain(draftSummary);

    await t.run(async (ctx) => {
      const study = await ctx.db
        .query('talkStudies')
        .withIndex('by_talkId', (q) => q.eq('talkId', published.talk._id))
        .unique();

      if (!study) {
        throw new Error('expected a study');
      }

      await ctx.db.patch(study._id, {
        studyStatus: 'published',
        summary: publishedSummary,
      });
    });

    const withPublished = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(withPublished?.summary).toBe(publishedSummary);
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

describe('listAllTalks', () => {
  it('filters talks by study status', async () => {
    const t = createConvexTest();
    const { asUser: asAdmin } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });

    await t.run(async (ctx) => {
      const speakerId = await ctx.db.insert('speakers', {
        firstName: 'John',
        lastName: 'Owen',
        slug: 'john-owen',
      });
      await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2024-06-01T12:00:00.000Z'),
        slug: 'study-none',
        speakerId,
        status: 'published',
        title: 'Study None',
      });
      const draftTalkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2024-06-02T12:00:00.000Z'),
        slug: 'study-draft',
        speakerId,
        status: 'published',
        title: 'Study Draft',
      });
      const publishedTalkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
        slug: 'study-published',
        speakerId,
        status: 'published',
        title: 'Study Published',
      });
      const backlogDraftTalkId = await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        slug: 'study-backlog-draft',
        speakerId,
        status: 'backlog',
        title: 'Study Backlog Draft',
      });
      const studyFields = {
        generatedAt: Date.now(),
        generator: 'test',
        outline: [{ heading: 'Grace', text: 'Grace is a gift' }],
        scriptureRefs: [{ book: 'Romans', chapter: 5, verseStart: 1 }],
        studyGuide: [{ kind: 'key_idea' as const, text: 'Grace is a gift' }],
        suggestedTopics: ['grace'],
        summary: 'A study of grace.',
      };

      await ctx.db.insert('talkStudies', {
        ...studyFields,
        studyStatus: 'draft',
        talkId: draftTalkId,
      });
      await ctx.db.insert('talkStudies', {
        ...studyFields,
        studyStatus: 'published',
        talkId: publishedTalkId,
      });
      await ctx.db.insert('talkStudies', {
        ...studyFields,
        studyStatus: 'draft',
        talkId: backlogDraftTalkId,
      });
    });

    const paginationOpts = { cursor: null, numItems: 50 };
    const none = await asAdmin.query(api.talks.listAllTalks, {
      paginationOpts,
      status: 'all',
      studyStatus: 'none',
    });
    const draft = await asAdmin.query(api.talks.listAllTalks, {
      paginationOpts,
      status: 'all',
      studyStatus: 'draft',
    });
    const published = await asAdmin.query(api.talks.listAllTalks, {
      paginationOpts,
      status: 'all',
      studyStatus: 'published',
    });
    const publishedDrafts = await asAdmin.query(api.talks.listAllTalks, {
      paginationOpts,
      status: 'published',
      studyStatus: 'draft',
    });
    const searchedDrafts = await asAdmin.query(api.talks.listAllTalks, {
      paginationOpts,
      search: 'Backlog',
      status: 'all',
      studyStatus: 'draft',
    });
    const firstPage = await asAdmin.query(api.talks.listAllTalks, {
      paginationOpts: { cursor: null, numItems: 1 },
      status: 'all',
      studyStatus: 'draft',
    });
    const secondPage = await asAdmin.query(api.talks.listAllTalks, {
      paginationOpts: { cursor: firstPage.continueCursor, numItems: 1 },
      status: 'all',
      studyStatus: 'draft',
    });

    expect(none.page.map((talk) => talk.slug)).toEqual(['study-none']);
    expect(draft.page.map((talk) => talk.slug).toSorted()).toEqual([
      'study-backlog-draft',
      'study-draft',
    ]);
    expect(published.page.map((talk) => talk.slug)).toEqual([
      'study-published',
    ]);
    expect(publishedDrafts.page.map((talk) => talk.slug)).toEqual([
      'study-draft',
    ]);
    expect(searchedDrafts.page.map((talk) => talk.slug)).toEqual([
      'study-backlog-draft',
    ]);
    expect(firstPage.isDone).toBe(false);
    expect(secondPage.isDone).toBe(true);
    expect(
      [firstPage.page[0]?.slug, secondPage.page[0]?.slug].toSorted()
    ).toEqual(['study-backlog-draft', 'study-draft']);
  });
});

describe('publishedAt order', () => {
  it('lists talks newest-first by publishedAt, not creation time', async () => {
    const t = createConvexTest();
    const speakerId = await t.run(async (ctx) => {
      const id = await ctx.db.insert('speakers', {
        firstName: 'John',
        lastName: 'Owen',
        slug: 'john-owen-order',
      });
      await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
        slug: 'newer-by-date',
        speakerId: id,
        status: 'published',
        title: 'Newer By Date',
      });
      await ctx.db.insert('talks', {
        mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
        publishedAt: Date.parse('2020-01-01T12:00:00.000Z'),
        slug: 'older-by-date',
        speakerId: id,
        status: 'published',
        title: 'Older By Date',
      });

      return id;
    });

    const listed = await t.query(api.talks.listTalks, {
      paginationOpts: { cursor: null, numItems: 50 },
    });
    const bySpeaker = await t.query(api.talks.listTalksBySpeaker, {
      speakerId,
    });
    const listedSlugs = listed.page.map((talk) => talk.slug);
    const speakerSlugs = bySpeaker.map((talk) => talk.slug);

    expect(listedSlugs.indexOf('newer-by-date')).toBeLessThan(
      listedSlugs.indexOf('older-by-date')
    );
    expect(speakerSlugs).toEqual(['newer-by-date', 'older-by-date']);
  });
});
