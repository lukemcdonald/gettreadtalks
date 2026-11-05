import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';
import { insertClip } from '../clips/test.factory';
import { insertSpeaker } from '../speakers/test.factory';
import { insertTalk } from '../talks/test.factory';

describe('searchSite', () => {
  it('returns published title matches and omits unpublished ones', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const result = await t.query(api.search.searchSite, {
      query: 'Grace',
    });

    expect(result.talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
    expect(result.talks[0]?.scripture).toBe('Romans 5:1-2');
  });

  it('returns talks that match a speaker name', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const result = await t.query(api.search.searchSite, {
      query: 'Bunyan',
    });

    expect(result.talks.map((talk) => talk.slug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
    expect(result.talks[0]?.speaker?.slug).toBe(
      visibilitySlugs.publishedSpeaker
    );
  });

  it('clamps a zero limit to one published talk', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);
    await t.run(async (ctx) => {
      const speaker = await ctx.db
        .query('speakers')
        .withIndex('by_slug', (q) =>
          q.eq('slug', visibilitySlugs.publishedSpeaker)
        )
        .unique();

      if (!speaker) {
        throw new Error('expected a published speaker');
      }

      await insertTalk(ctx, {
        slug: 'clamp-limit-alpha',
        speakerId: speaker._id,
        title: 'ClampLimit Alpha',
      });
      await insertTalk(ctx, {
        slug: 'clamp-limit-beta',
        speakerId: speaker._id,
        title: 'ClampLimit Beta',
      });
      await insertTalk(ctx, {
        slug: 'clamp-limit-gamma',
        speakerId: speaker._id,
        title: 'ClampLimit Gamma',
      });
    });

    const result = await t.query(api.search.searchSite, {
      limit: 0,
      query: 'ClampLimit',
    });

    expect(result.talks).toHaveLength(1);
  });

  it('omits talks whose speaker is gone and fills from later title hits', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);
    await t.run(async (ctx) => {
      const publishedSpeaker = await ctx.db
        .query('speakers')
        .withIndex('by_slug', (q) =>
          q.eq('slug', visibilitySlugs.publishedSpeaker)
        )
        .unique();

      if (!publishedSpeaker) {
        throw new Error('expected a published speaker');
      }

      const ghostSpeakerId = await insertSpeaker(ctx, {
        firstName: 'Ghost',
        lastName: 'Orphan',
        slug: 'ghost-orphan',
      });

      await Promise.all(
        [0, 1, 2].map((index) =>
          insertTalk(ctx, {
            slug: `orphan-fill-hidden-${index}`,
            speakerId: ghostSpeakerId,
            title: 'OrphanFillHidden',
          })
        )
      );

      await insertTalk(ctx, {
        slug: 'orphan-fill-visible',
        speakerId: publishedSpeaker._id,
        title: 'Also OrphanFillHidden visible',
      });
      await ctx.db.delete(ghostSpeakerId);
    });

    const result = await t.query(api.search.searchSite, {
      limit: 1,
      query: 'OrphanFillHidden',
    });

    expect(result.talks.map((talk) => talk.slug)).toEqual([
      'orphan-fill-visible',
    ]);
    expect(result.talks[0]?.speaker?.slug).toBe(
      visibilitySlugs.publishedSpeaker
    );
  });

  it('returns published clips and omits those whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const result = await t.query(api.search.searchSite, {
      query: 'Grace',
    });

    expect(result.clips.map((clip) => clip.slug).toSorted()).toEqual([
      visibilitySlugs.clipOnPublishedTalk,
      visibilitySlugs.standaloneClip,
    ]);
  });

  it('pages past clips on unpublished talks to fill the limit', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);
    await t.run(async (ctx) => {
      const draftTalk = await ctx.db
        .query('talks')
        .withIndex('by_slug', (q) => q.eq('slug', visibilitySlugs.draftTalk))
        .unique();
      const publishedSpeaker = await ctx.db
        .query('speakers')
        .withIndex('by_slug', (q) =>
          q.eq('slug', visibilitySlugs.publishedSpeaker)
        )
        .unique();

      if (!draftTalk || !publishedSpeaker) {
        throw new Error('expected catalog talk and speaker');
      }

      await Promise.all(
        [0, 1, 2].map((index) =>
          insertClip(ctx, {
            slug: `clip-fill-hidden-${index}`,
            speakerId: publishedSpeaker._id,
            talkId: draftTalk._id,
            title: 'ClipFillHidden',
          })
        )
      );

      await insertClip(ctx, {
        slug: 'clip-fill-visible',
        speakerId: publishedSpeaker._id,
        title: 'Also ClipFillHidden visible',
      });
    });

    const result = await t.query(api.search.searchSite, {
      limit: 1,
      query: 'ClipFillHidden',
    });

    expect(result.clips.map((clip) => clip.slug)).toEqual([
      'clip-fill-visible',
    ]);
  });
});
