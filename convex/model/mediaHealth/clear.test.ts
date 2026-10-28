import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import { createConvexTest, signInAs } from '../../test.setup';
import { shouldClearMediaChecks } from './clear';

const CHECKED_AT = 1_700_000_000_000;
const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

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
  it('drops media checks when a talk is archived', async () => {
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

    await asUser.mutation(api.talks.archiveTalk, { talkId });

    const remaining = await t.run(
      async (ctx) => await ctx.db.query('mediaChecks').collect()
    );

    expect(remaining).toEqual([]);
  });
});
