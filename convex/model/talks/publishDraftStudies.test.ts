import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

const studyFields = {
  generatedAt: Date.now(),
  generator: 'test',
  outline: [],
  scriptureRefs: [],
  studyGuide: [],
  suggestedTopics: [],
};

describe('publishDraftStudies', () => {
  it('previews without writes, publishes eligible drafts, and is a no-op on re-run', async () => {
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

    const ids = await t.run(async (ctx) => {
      const draftTalk = await ctx.db
        .query('talks')
        .withIndex('by_slug', (q) => q.eq('slug', visibilitySlugs.draftTalk))
        .unique();
      const hiddenTalk = await ctx.db
        .query('talks')
        .withIndex('by_slug', (q) =>
          q.eq('slug', 'unpublished-from-draft-speaker')
        )
        .unique();

      if (!draftTalk || !hiddenTalk) {
        throw new Error('expected seed talks');
      }

      const eligibleId = await ctx.db.insert('talkStudies', {
        ...studyFields,
        studyStatus: 'draft',
        summary: 'A draft study summary ready to publish.',
        talkId: published.talk._id,
      });
      const skippedId = await ctx.db.insert('talkStudies', {
        ...studyFields,
        studyStatus: 'draft',
        summary: '   ',
        talkId: draftTalk._id,
      });
      const alreadyPublishedId = await ctx.db.insert('talkStudies', {
        ...studyFields,
        studyStatus: 'published',
        summary: 'Already on the talk page.',
        talkId: hiddenTalk._id,
      });

      return {
        alreadyPublishedId,
        eligibleId,
        skippedId,
      };
    });

    const dryRun = await t.mutation(internal.talks.publishDraftStudies, {});

    expect(dryRun).toEqual({
      eligible: 1,
      isDone: false,
      published: 0,
      skipped: 1,
      titles: ['Grace Abounding'],
    });

    const afterDryRun = await t.run(async (ctx) => ({
      alreadyPublished: await ctx.db.get(ids.alreadyPublishedId),
      eligible: await ctx.db.get(ids.eligibleId),
      skipped: await ctx.db.get(ids.skippedId),
    }));

    expect(afterDryRun.eligible?.studyStatus).toBe('draft');
    expect(afterDryRun.eligible?.manuallyEditedAt).toBeUndefined();
    expect(afterDryRun.skipped?.studyStatus).toBe('draft');
    expect(afterDryRun.alreadyPublished?.studyStatus).toBe('published');
    expect(afterDryRun.alreadyPublished?.manuallyEditedAt).toBeUndefined();

    const stillDraftOnPage = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(stillDraftOnPage?.summary).toBeNull();

    const beforePublish = Date.now();
    const publishedRun = await t.mutation(internal.talks.publishDraftStudies, {
      dryRun: false,
    });

    expect(publishedRun).toEqual({
      eligible: 0,
      isDone: true,
      published: 1,
      skipped: 1,
      titles: ['Grace Abounding'],
    });

    const afterPublish = await t.run(async (ctx) => ({
      alreadyPublished: await ctx.db.get(ids.alreadyPublishedId),
      eligible: await ctx.db.get(ids.eligibleId),
      skipped: await ctx.db.get(ids.skippedId),
    }));

    expect(afterPublish.eligible?.studyStatus).toBe('published');
    expect(afterPublish.eligible?.summary).toBe(
      'A draft study summary ready to publish.'
    );
    expect(afterPublish.eligible?.manuallyEditedAt).toBeGreaterThanOrEqual(
      beforePublish
    );
    expect(afterPublish.skipped?.studyStatus).toBe('draft');
    expect(afterPublish.skipped?.manuallyEditedAt).toBeUndefined();
    expect(afterPublish.alreadyPublished?.studyStatus).toBe('published');
    expect(afterPublish.alreadyPublished?.manuallyEditedAt).toBeUndefined();

    const onPage = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });

    expect(onPage?.summary).toBe('A draft study summary ready to publish.');

    const rerun = await t.mutation(internal.talks.publishDraftStudies, {
      dryRun: false,
    });

    expect(rerun).toEqual({
      eligible: 0,
      isDone: true,
      published: 0,
      skipped: 1,
      titles: [],
    });

    const afterRerun = await t.run(
      async (ctx) => await ctx.db.get(ids.eligibleId)
    );

    expect(afterRerun?.manuallyEditedAt).toBe(
      afterPublish.eligible?.manuallyEditedAt
    );
  });
});
