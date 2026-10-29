import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import { ErrorCodes } from '../../lib/errors';
import { createConvexTest, signInAs } from '../../test.setup';
import { insertSpeaker } from '../speakers/test-factory.fixture';
import { insertTalk } from './test-factory.fixture';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';
const PAST_PUBLISHED_AT = Date.parse('2020-01-15T00:00:00.000Z');
const FUTURE_PUBLISHED_AT = Date.parse('2099-01-01T00:00:00.000Z');

async function seedAdminTalk() {
  const t = createConvexTest();
  const speakerId = await t.run(
    async (ctx) =>
      await insertSpeaker(ctx, {
        firstName: 'John',
        lastName: 'Owen',
        slug: 'john-owen',
      })
  );
  const { asUser: asAdmin } = await signInAs(t, {
    email: 'admin@example.test',
    name: 'Admin',
    role: 'admin',
  });

  return { asAdmin, speakerId, t };
}

describe('createTalk publishedAt', () => {
  it('stores a past publish date', async () => {
    const { asAdmin, speakerId, t } = await seedAdminTalk();
    const talkId = await asAdmin.mutation(api.talks.createTalk, {
      mediaUrl: MEDIA_URL,
      publishedAt: PAST_PUBLISHED_AT,
      speakerId,
      status: 'published',
      title: 'Past Date Talk',
    });
    const talk = await t.run(async (ctx) => await ctx.db.get('talks', talkId));

    expect(talk?.publishedAt).toBe(PAST_PUBLISHED_AT);
  });

  it('defaults to now when first publishing without a date', async () => {
    const { asAdmin, speakerId, t } = await seedAdminTalk();
    const before = Date.now();
    const talkId = await asAdmin.mutation(api.talks.createTalk, {
      mediaUrl: MEDIA_URL,
      speakerId,
      status: 'published',
      title: 'Default Date Talk',
    });
    const talk = await t.run(async (ctx) => await ctx.db.get('talks', talkId));

    expect(talk?.publishedAt).toBeGreaterThanOrEqual(before);
    expect(talk?.publishedAt).toBeLessThanOrEqual(Date.now());
  });

  it('rejects a future publish date', async () => {
    const { asAdmin, speakerId } = await seedAdminTalk();

    await expect(
      asAdmin.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        publishedAt: FUTURE_PUBLISHED_AT,
        speakerId,
        status: 'published',
        title: 'Future Date Talk',
      })
    ).rejects.toMatchObject({
      data: {
        errorCode: ErrorCodes.VALIDATION_FAILED,
        field: 'publishedAt',
      },
    });
  });
});

describe('updateTalk publishedAt', () => {
  it('moves a published talk to a past date', async () => {
    const { asAdmin, speakerId, t } = await seedAdminTalk();
    const talkId = await asAdmin.mutation(api.talks.createTalk, {
      mediaUrl: MEDIA_URL,
      speakerId,
      status: 'published',
      title: 'Move Date Talk',
    });

    await asAdmin.mutation(api.talks.updateTalk, {
      publishedAt: PAST_PUBLISHED_AT,
      status: 'published',
      talkId,
    });

    const talk = await t.run(async (ctx) => await ctx.db.get('talks', talkId));

    expect(talk?.publishedAt).toBe(PAST_PUBLISHED_AT);
  });

  it('rejects a future publish date', async () => {
    const { asAdmin, speakerId } = await seedAdminTalk();
    const talkId = await asAdmin.mutation(api.talks.createTalk, {
      mediaUrl: MEDIA_URL,
      speakerId,
      status: 'published',
      title: 'Future Update Talk',
    });

    await expect(
      asAdmin.mutation(api.talks.updateTalk, {
        publishedAt: FUTURE_PUBLISHED_AT,
        status: 'published',
        talkId,
      })
    ).rejects.toMatchObject({
      data: {
        errorCode: ErrorCodes.VALIDATION_FAILED,
        field: 'publishedAt',
      },
    });
  });
});

describe('backfillTalkPublishedAt', () => {
  it('fills missing dates and leaves existing dates alone', async () => {
    const t = createConvexTest();
    const ids = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx);
      const missingId = await insertTalk(ctx, {
        slug: 'missing-date',
        speakerId,
        title: 'Missing Date',
      });
      const keptId = await insertTalk(ctx, {
        publishedAt: PAST_PUBLISHED_AT,
        slug: 'kept-date',
        speakerId,
        title: 'Kept Date',
      });
      const backlogId = await insertTalk(ctx, {
        slug: 'backlog-talk',
        speakerId,
        status: 'backlog',
        title: 'Backlog Talk',
      });

      return { backlogId, keptId, missingId };
    });

    const first = await t.mutation(internal.talks.backfillTalkPublishedAt, {});
    const missing = await t.run(
      async (ctx) => await ctx.db.get('talks', ids.missingId)
    );
    const kept = await t.run(
      async (ctx) => await ctx.db.get('talks', ids.keptId)
    );
    const backlog = await t.run(
      async (ctx) => await ctx.db.get('talks', ids.backlogId)
    );

    expect(first.updated).toBe(1);
    expect(missing?.publishedAt).toBe(missing?._creationTime);
    expect(kept?.publishedAt).toBe(PAST_PUBLISHED_AT);
    expect(backlog?.publishedAt).toBeUndefined();

    const second = await t.mutation(internal.talks.backfillTalkPublishedAt, {});

    expect(second.updated).toBe(0);
  });
});
