import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import { createConvexTest, signInAs } from '../../test.setup';
import { shouldClearMediaChecks } from './clear';

const CHECKED_AT = 1_700_000_000_000;
const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';
const NEW_MEDIA_URL = 'https://www.youtube.com/watch?v=newHealthyUrl';

describe('shouldClearMediaChecks', () => {
  it('keeps flags on a still-published talk whose URL did not change', () => {
    expect(
      shouldClearMediaChecks({
        mediaUrlChanged: false,
        published: true,
      })
    ).toBe(false);
  });

  it('clears flags when the talk is unpublished or the media URL changed', () => {
    expect(
      shouldClearMediaChecks({
        mediaUrlChanged: false,
        published: false,
      })
    ).toBe(true);
    expect(
      shouldClearMediaChecks({
        mediaUrlChanged: true,
        published: true,
      })
    ).toBe(true);
  });
});

describe('clearMediaChecksForEntity', () => {
  it('drops archived talks and clips from the next digest scan', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
    });
    const ids = await t.run(async (ctx) => {
      const speakerId = await ctx.db.insert('speakers', {
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
      });
      const talkId = await ctx.db.insert('talks', {
        mediaUrl: MEDIA_URL,
        slug: 'first-talk',
        speakerId,
        status: 'published',
        title: 'First Talk',
      });
      const clipId = await ctx.db.insert('clips', {
        mediaUrl: MEDIA_URL,
        slug: 'first-clip',
        status: 'published',
        title: 'First Clip',
      });

      return { clipId, talkId };
    });

    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT,
      entityId: ids.talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
      observedStatus: 'private',
    });
    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT,
      entityId: ids.clipId,
      entityTable: 'clips',
      mediaUrl: MEDIA_URL,
      observedStatus: 'missing',
    });

    await asUser.mutation(api.talks.archiveTalk, { talkId: ids.talkId });
    await asUser.mutation(api.clips.archiveClip, { clipId: ids.clipId });

    const talks = await t.query(internal.mediaHealth.listPublishedMediaPage, {
      paginationOpts: { cursor: null, numItems: 10 },
      source: 'talks',
    });
    const clips = await t.query(internal.mediaHealth.listPublishedMediaPage, {
      paginationOpts: { cursor: null, numItems: 10 },
      source: 'clips',
    });
    const remaining = await t.run(
      async (ctx) => await ctx.db.query('mediaChecks').collect()
    );

    expect(talks.page.map((item) => item.entityId)).not.toContain(ids.talkId);
    expect(clips.page.map((item) => item.entityId)).not.toContain(ids.clipId);
    expect(remaining).toEqual([]);
  });

  it('drops media checks when the media URL is replaced', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
    });
    const talkId = await t.run(async (ctx) => {
      const speakerId = await ctx.db.insert('speakers', {
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
      });

      return await ctx.db.insert('talks', {
        mediaUrl: MEDIA_URL,
        slug: 'first-talk',
        speakerId,
        status: 'published',
        title: 'First Talk',
      });
    });

    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT,
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
      observedStatus: 'private',
    });

    await asUser.mutation(api.talks.updateTalk, {
      mediaUrl: NEW_MEDIA_URL,
      talkId,
    });

    const remaining = await t.run(
      async (ctx) => await ctx.db.query('mediaChecks').collect()
    );

    expect(remaining).toEqual([]);
  });
});
