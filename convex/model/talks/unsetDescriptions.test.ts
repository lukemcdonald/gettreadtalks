import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('unsetTalkDescriptions', () => {
  it('counts leftover descriptions and published talks with no About', async () => {
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

    await t.run(async (ctx) => {
      await ctx.db.patch(published.talk._id, {
        description: 'A leftover talk description.',
      });
    });

    const dryRun = await t.mutation(internal.talks.unsetTalkDescriptions, {});

    expect(dryRun).toEqual({
      isDone: false,
      publishedTalksWithoutPublishedSummary: 1,
      talksWithDescription: 1,
      totalTalks: 3,
      unset: 0,
    });

    const stillThere = await t.run(
      async (ctx) => await ctx.db.get(published.talk._id)
    );

    expect(stillThere?.description).toBe('A leftover talk description.');
  });

  it('unsets descriptions in a real run and leaves other fields', async () => {
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

    await t.run(async (ctx) => {
      await ctx.db.patch(published.talk._id, {
        description: 'A leftover talk description.',
      });
      await ctx.db.insert('talkStudies', {
        generatedAt: Date.now(),
        generator: 'test',
        outline: [],
        scriptureRefs: [],
        studyGuide: [],
        studyStatus: 'published',
        suggestedTopics: [],
        summary: 'Published study summary for the talk page.',
        talkId: published.talk._id,
      });
    });

    const result = await t.mutation(internal.talks.unsetTalkDescriptions, {
      dryRun: false,
    });

    expect(result).toEqual({
      isDone: true,
      publishedTalksWithoutPublishedSummary: 0,
      talksWithDescription: 0,
      totalTalks: 3,
      unset: 1,
    });

    const updated = await t.run(
      async (ctx) => await ctx.db.get(published.talk._id)
    );

    expect(updated?.description).toBeUndefined();
    expect(updated?.title).toBe(published.talk.title);
    expect(updated?.slug).toBe(published.talk.slug);
  });
});
