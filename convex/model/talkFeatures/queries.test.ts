import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';

import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import { createConvexTest, signInAs } from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { insertTalk } from '../talks/test.factory';

const STUDY_SECRET = 'PRIVATE_STUDY_SENTINEL_volta575';

async function insertStudy(
  ctx: MutationCtx,
  talkId: Id<'talks'>,
  overrides?: { body?: string; status?: 'draft' | 'published' }
) {
  return await ctx.db.insert('talkFeatures', {
    body: overrides?.body ?? STUDY_SECRET,
    generatedAt: Date.now(),
    kind: 'study',
    status: overrides?.status ?? 'draft',
    talkId,
    updatedAt: Date.now(),
  });
}

describe('getTalkFeatureProgress', () => {
  it('returns study metadata without the body', async () => {
    const t = createConvexTest();
    const { asUser: asAdmin } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });
    const talkId = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx);
      const id = await insertTalk(ctx, {
        slug: 'progress-study',
        speakerId,
        title: 'Progress Study',
      });
      await insertStudy(ctx, id, {
        body: STUDY_SECRET,
        status: 'published',
      });

      return id;
    });

    const progress = await asAdmin.query(
      api.talkFeatures.getTalkFeatureProgress,
      {
        kind: 'study',
        talkId,
      }
    );
    const full = await asAdmin.query(api.talkFeatures.getTalkFeature, {
      kind: 'study',
      talkId,
    });

    expect(progress).toEqual({
      hasBody: true,
      status: 'published',
    });
    expect(progress).not.toHaveProperty('body');
    expect(JSON.stringify(progress)).not.toContain(STUDY_SECRET);
    expect(full?.body).toBe(STUDY_SECRET);
  });

  it('returns null when the talk has no study', async () => {
    const t = createConvexTest();
    const { asUser: asAdmin } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });
    const talkId = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx);

      return await insertTalk(ctx, {
        slug: 'missing-study',
        speakerId,
        title: 'Missing Study',
      });
    });

    expect(
      await asAdmin.query(api.talkFeatures.getTalkFeatureProgress, {
        kind: 'study',
        talkId,
      })
    ).toBeNull();
  });
});
