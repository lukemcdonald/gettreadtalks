import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import { createConvexTest, signInAs } from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { insertTalk } from '../talks/test.factory';

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
      await ctx.db.insert('talkFeatures', {
        body: '## Main points\n\nA published study.',
        generatedAt: Date.now(),
        kind: 'study',
        status: 'published',
        talkId: id,
        updatedAt: Date.now(),
      });

      return id;
    });

    expect(
      await asAdmin.query(api.talkFeatures.getTalkFeatureProgress, {
        kind: 'study',
        talkId,
      })
    ).toEqual({
      hasBody: true,
      status: 'published',
    });
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
