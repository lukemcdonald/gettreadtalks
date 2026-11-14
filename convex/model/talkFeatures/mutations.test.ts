import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import { ErrorCodes } from '../../lib/errors';
import { createConvexTest, signInAs } from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { insertTalk } from '../talks/test.factory';
import { hasReviewedTalkFeature } from './helpers';

const STUDY_BODY = '## Main points\n\nA confirmed study draft.';

async function insertStudy(
  ctx: MutationCtx,
  args: {
    body?: string;
    status?: 'draft' | 'published';
    talkId: Id<'talks'>;
  }
) {
  return await ctx.db.insert('talkFeatures', {
    body: args.body ?? STUDY_BODY,
    generatedAt: Date.now(),
    kind: 'study',
    status: args.status ?? 'draft',
    talkId: args.talkId,
    updatedAt: Date.now(),
  });
}

describe('publishStudyDrafts', () => {
  it('publishes confirmed nonempty drafts and skips the rest', async () => {
    const t = createConvexTest();
    const { asUser: asAdmin } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });

    const ids = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx);
      const draftTalkId = await insertTalk(ctx, {
        slug: 'draft-study',
        speakerId,
        title: 'Draft Study',
      });
      const emptyTalkId = await insertTalk(ctx, {
        slug: 'empty-study',
        speakerId,
        title: 'Empty Study',
      });
      const publishedTalkId = await insertTalk(ctx, {
        slug: 'published-study',
        speakerId,
        title: 'Published Study',
      });
      const extraTalkId = await insertTalk(ctx, {
        slug: 'extra-study',
        speakerId,
        title: 'Extra Study',
      });
      const draftId = await insertStudy(ctx, { talkId: draftTalkId });
      const emptyId = await insertStudy(ctx, {
        body: '   ',
        talkId: emptyTalkId,
      });
      const publishedId = await insertStudy(ctx, {
        status: 'published',
        talkId: publishedTalkId,
      });
      const extraId = await insertStudy(ctx, { talkId: extraTalkId });

      return { draftId, emptyId, extraId, publishedId };
    });

    const eligible = await asAdmin.query(
      api.talkFeatures.listEligibleStudyDrafts,
      {}
    );

    expect(eligible.featureIds.toSorted()).toEqual(
      [ids.draftId, ids.extraId].toSorted()
    );

    const result = await asAdmin.mutation(api.talkFeatures.publishStudyDrafts, {
      featureIds: [ids.draftId, ids.draftId, ids.emptyId, ids.publishedId],
    });

    expect(result).toEqual({ published: 1, skipped: 2 });

    const after = await t.run(async (ctx) => ({
      draft: await ctx.db.get(ids.draftId),
      empty: await ctx.db.get(ids.emptyId),
      extra: await ctx.db.get(ids.extraId),
      published: await ctx.db.get(ids.publishedId),
    }));

    expect(after.draft?.status).toBe('published');
    expect(after.draft?.body).toBe(STUDY_BODY);
    expect(hasReviewedTalkFeature(after.draft ?? null)).toBe(true);
    expect(after.empty?.status).toBe('draft');
    expect(after.empty?.body).toBe('   ');
    expect(after.published?.status).toBe('published');
    expect(after.published?.body).toBe(STUDY_BODY);
    expect(after.extra?.status).toBe('draft');
    expect(after.extra?.body).toBe(STUDY_BODY);
  });

  it('skips missing, deleted, and stale ids without changing talk status', async () => {
    const t = createConvexTest();
    const { asUser: asAdmin } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });

    const seeded = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx);
      const backlogTalkId = await insertTalk(ctx, {
        slug: 'backlog-study',
        speakerId,
        status: 'backlog',
        title: 'Backlog Study',
      });
      const staleTalkId = await insertTalk(ctx, {
        slug: 'stale-study',
        speakerId,
        status: 'published',
        title: 'Stale Study',
      });
      const deletedTalkId = await insertTalk(ctx, {
        slug: 'deleted-study',
        speakerId,
        title: 'Deleted Study',
      });
      const keepTalkId = await insertTalk(ctx, {
        slug: 'keep-study',
        speakerId,
        status: 'backlog',
        title: 'Keep Study',
      });
      const backlogStudyId = await insertStudy(ctx, { talkId: backlogTalkId });
      const staleId = await insertStudy(ctx, { talkId: staleTalkId });
      const deletedId = await insertStudy(ctx, { talkId: deletedTalkId });
      const keepId = await insertStudy(ctx, { talkId: keepTalkId });

      await ctx.db.patch(staleId, { body: '   ' });
      await ctx.db.delete(deletedId);

      return {
        backlogStudyId,
        backlogTalkId,
        deletedId,
        keepId,
        staleId,
      };
    });

    const result = await asAdmin.mutation(api.talkFeatures.publishStudyDrafts, {
      featureIds: [
        seeded.backlogStudyId,
        seeded.staleId,
        seeded.deletedId,
        seeded.keepId,
      ],
    });

    expect(result).toEqual({ published: 2, skipped: 2 });

    const after = await t.run(async (ctx) => ({
      backlogStudy: await ctx.db.get(seeded.backlogStudyId),
      backlogTalk: await ctx.db.get(seeded.backlogTalkId),
      deleted: await ctx.db.get(seeded.deletedId),
      keep: await ctx.db.get(seeded.keepId),
      stale: await ctx.db.get(seeded.staleId),
    }));

    expect(after.backlogStudy?.status).toBe('published');
    expect(after.backlogStudy?.body).toBe(STUDY_BODY);
    expect(after.backlogTalk?.status).toBe('backlog');
    expect(after.keep?.status).toBe('published');
    expect(after.stale?.status).toBe('draft');
    expect(after.stale?.body).toBe('   ');
    expect(after.deleted).toBeNull();
  });

  it('requires admin', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'member@example.test',
      name: 'Member',
      role: 'user',
    });

    await expect(
      t.query(api.talkFeatures.listEligibleStudyDrafts, {})
    ).rejects.toMatchObject({
      data: { errorCode: ErrorCodes.AUTH_REQUIRED },
    });
    await expect(
      asUser.query(api.talkFeatures.listEligibleStudyDrafts, {})
    ).rejects.toMatchObject({
      data: { errorCode: ErrorCodes.FORBIDDEN },
    });
    await expect(
      asUser.mutation(api.talkFeatures.publishStudyDrafts, { featureIds: [] })
    ).rejects.toMatchObject({
      data: { errorCode: ErrorCodes.FORBIDDEN },
    });
  });
});
