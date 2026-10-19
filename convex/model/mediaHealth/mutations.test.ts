import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import { createConvexTest, signInAs } from '../../test.setup';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';
const CHECKED_AT = 1_700_000_000_000;

describe('media health checks', () => {
  it('opens, ignores, and resolves stale unpublished rows', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });
    const talkId = await t.run(async (ctx) => {
      const speakerId = await ctx.db.insert('speakers', {
        firstName: 'John',
        lastName: 'Bunyan',
        slug: 'john-bunyan',
      });

      return await ctx.db.insert('talks', {
        mediaUrl: MEDIA_URL,
        publishedAt: CHECKED_AT,
        slug: 'grace-abounding',
        speakerId,
        status: 'published',
        title: 'Grace Abounding',
      });
    });

    const first = await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT,
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
      observedStatus: 'private',
    });

    expect(first).toMatchObject({
      firstBrokenAt: CHECKED_AT,
      isNew: true,
      persistStatus: 'private',
      state: 'open',
    });

    const open = await asUser.query(api.mediaHealth.listOpenMediaChecks, {});
    const [openItem] = open;

    expect(open).toHaveLength(1);
    expect(openItem).toMatchObject({
      status: 'private',
      title: 'Grace Abounding',
    });

    if (!openItem) {
      throw new Error('expected an open media check');
    }

    await asUser.mutation(api.mediaHealth.ignoreMediaCheck, {
      mediaCheckId: openItem._id,
    });
    expect(await asUser.query(api.mediaHealth.listOpenMediaChecks, {})).toEqual(
      []
    );

    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT + 1,
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
      observedStatus: 'missing',
    });
    expect(await asUser.query(api.mediaHealth.listOpenMediaChecks, {})).toEqual(
      []
    );

    await t.run(async (ctx) => {
      await ctx.db.patch(talkId, { status: 'archived' });
    });
    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT + 2,
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
      observedStatus: 'private',
    });
    await t.mutation(internal.mediaHealth.resolveStaleMediaChecks, {});

    const ignored = await t.query(internal.mediaHealth.getMediaCheck, {
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
    });
    expect(ignored?.state).toBe('resolved');
  });

  it('opens a new row when an ignored url changes', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });
    const nextUrl = 'https://www.youtube.com/watch?v=LYncFGsKvCQ';
    const talkId = await t.run(async (ctx) => {
      const speakerId = await ctx.db.insert('speakers', {
        firstName: 'John',
        lastName: 'Bunyan',
        slug: 'john-bunyan',
      });

      return await ctx.db.insert('talks', {
        mediaUrl: MEDIA_URL,
        publishedAt: CHECKED_AT,
        slug: 'grace-abounding',
        speakerId,
        status: 'published',
        title: 'Grace Abounding',
      });
    });

    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT,
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
      observedStatus: 'private',
    });
    const [openItem] = await asUser.query(
      api.mediaHealth.listOpenMediaChecks,
      {}
    );

    if (!openItem) {
      throw new Error('expected an open media check');
    }

    await asUser.mutation(api.mediaHealth.ignoreMediaCheck, {
      mediaCheckId: openItem._id,
    });

    await t.run(async (ctx) => {
      await ctx.db.patch(talkId, { mediaUrl: nextUrl });
    });
    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT + 1,
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: nextUrl,
      observedStatus: 'private',
    });
    await t.mutation(internal.mediaHealth.resolveStaleMediaChecks, {});

    const open = await asUser.query(api.mediaHealth.listOpenMediaChecks, {});
    const previous = await t.query(internal.mediaHealth.getMediaCheck, {
      entityId: talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
    });

    const [nextOpen] = open;

    expect(open).toHaveLength(1);
    expect(nextOpen?.status).toBe('private');
    expect(previous?.state).toBe('resolved');
  });
});
