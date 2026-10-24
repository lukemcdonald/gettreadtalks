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

function requireValue<T>(value: T | null | undefined, label: string): T {
  if (value) {
    return value;
  }

  throw new Error(`expected ${label}`);
}

describe('publishDraftStudies', () => {
  it('previews without writes, publishes eligible drafts, and is a no-op on re-run', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const publishedTalk = requireValue(
      await t.query(api.talks.getTalkBySlug, {
        speakerSlug: visibilitySlugs.publishedSpeaker,
        talkSlug: visibilitySlugs.publishedTalk,
      }),
      'a published talk'
    );

    const ids = await t.run(async (ctx) => {
      const draftTalk = requireValue(
        await ctx.db
          .query('talks')
          .withIndex('by_slug', (q) => q.eq('slug', visibilitySlugs.draftTalk))
          .unique(),
        'a draft talk'
      );
      const hiddenTalk = requireValue(
        await ctx.db
          .query('talks')
          .withIndex('by_slug', (q) =>
            q.eq('slug', 'unpublished-from-draft-speaker')
          )
          .unique(),
        'a hidden talk'
      );

      return {
        alreadyPublishedId: await ctx.db.insert('talkStudies', {
          ...studyFields,
          studyStatus: 'published',
          summary: 'Already on the talk page.',
          talkId: hiddenTalk._id,
        }),
        eligibleId: await ctx.db.insert('talkStudies', {
          ...studyFields,
          studyStatus: 'draft',
          summary: 'A draft study summary ready to publish.',
          talkId: publishedTalk.talk._id,
        }),
        skippedId: await ctx.db.insert('talkStudies', {
          ...studyFields,
          studyStatus: 'draft',
          summary: '   ',
          talkId: draftTalk._id,
        }),
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

    const afterDryRun = requireValue(
      await t.run(async (ctx) => await ctx.db.get(ids.eligibleId)),
      'the eligible study after dry run'
    );

    expect(afterDryRun.studyStatus).toBe('draft');
    expect(afterDryRun.manuallyEditedAt).toBeUndefined();

    const pageAfterDryRun = requireValue(
      await t.query(api.talks.getTalkBySlug, {
        speakerSlug: visibilitySlugs.publishedSpeaker,
        talkSlug: visibilitySlugs.publishedTalk,
      }),
      'the talk page after dry run'
    );

    expect(pageAfterDryRun.summary).toBeNull();

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
      alreadyPublished: requireValue(
        await ctx.db.get(ids.alreadyPublishedId),
        'the already published study'
      ),
      eligible: requireValue(
        await ctx.db.get(ids.eligibleId),
        'the eligible study after publish'
      ),
      skipped: requireValue(
        await ctx.db.get(ids.skippedId),
        'the skipped study'
      ),
    }));

    expect(afterPublish.eligible.studyStatus).toBe('published');
    expect(afterPublish.eligible.summary).toBe(
      'A draft study summary ready to publish.'
    );
    expect(afterPublish.eligible.manuallyEditedAt).toBeGreaterThanOrEqual(
      beforePublish
    );
    expect(afterPublish.skipped.studyStatus).toBe('draft');
    expect(afterPublish.skipped.manuallyEditedAt).toBeUndefined();
    expect(afterPublish.alreadyPublished.studyStatus).toBe('published');
    expect(afterPublish.alreadyPublished.manuallyEditedAt).toBeUndefined();

    const pageAfterPublish = requireValue(
      await t.query(api.talks.getTalkBySlug, {
        speakerSlug: visibilitySlugs.publishedSpeaker,
        talkSlug: visibilitySlugs.publishedTalk,
      }),
      'the talk page after publish'
    );

    expect(pageAfterPublish.summary).toBe(
      'A draft study summary ready to publish.'
    );

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

    const afterRerun = requireValue(
      await t.run(async (ctx) => await ctx.db.get(ids.eligibleId)),
      'the eligible study after re-run'
    );

    expect(afterRerun.manuallyEditedAt).toBe(
      afterPublish.eligible.manuallyEditedAt
    );
  });
});
