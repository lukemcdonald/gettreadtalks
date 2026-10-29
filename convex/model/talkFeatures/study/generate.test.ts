import { describe, expect, it } from 'vitest';

import { api, internal } from '../../../_generated/api';
import { ErrorCodes } from '../../../lib/errors';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../../test.setup';
import { talkStudyGenerator } from './generate';

const GENERATED_STUDY_BODY = `## Main points

### A father who runs
The father runs before the speech is finished. Luke 15:20

## Key passages

### Luke 15:11-32
The father runs to the returning son.`;

async function seedTalkWithTranscript() {
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

  await t.mutation(internal.talks.upsertTalkTranscript, {
    source: 'youtube_captions',
    status: 'done',
    talkId: published.talk._id,
    text: 'Cleaned transcript for study generation.',
  });

  const { asUser: asAdmin } = await signInAs(t, {
    email: 'admin@example.test',
    name: 'Admin',
    role: 'admin',
  });
  const { asUser: asMember } = await signInAs(t, {
    email: 'member@example.test',
    name: 'Member',
    role: 'user',
  });

  return {
    asAdmin,
    asMember,
    t,
    talkId: published.talk._id,
  };
}

describe('generateStudy', () => {
  it('saves a draft and refuses a manually edited or published study', async () => {
    const { asAdmin, asMember, t, talkId } = await seedTalkWithTranscript();
    const previousKey = process.env.AI_GATEWAY_API_KEY;
    const previousGenerate = talkStudyGenerator.generate;

    talkStudyGenerator.generate = () => Promise.resolve(GENERATED_STUDY_BODY);
    process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

    try {
      await expect(
        t.action(api.talkFeatures.generateStudy, { talkId })
      ).rejects.toMatchObject({
        data: {
          errorCode: ErrorCodes.AUTH_REQUIRED,
        },
      });
      await expect(
        asMember.action(api.talkFeatures.generateStudy, { talkId })
      ).rejects.toMatchObject({
        data: {
          errorCode: ErrorCodes.FORBIDDEN,
        },
      });

      const created = await asAdmin.action(api.talkFeatures.generateStudy, {
        talkId,
      });

      expect(created.status).toBe('success');

      const draft = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId,
      });

      expect(draft).toEqual(
        expect.objectContaining({
          body: GENERATED_STUDY_BODY,
          status: 'draft',
        })
      );
      expect(draft?.manuallyEditedAt).toBeUndefined();

      await asAdmin.mutation(api.talkFeatures.updateTalkFeature, {
        body: '## Main points\n\nHand-edited study.',
        kind: 'study',
        status: 'draft',
        talkId,
      });

      const refusedManual = await asAdmin.action(
        api.talkFeatures.generateStudy,
        { talkId }
      );
      const manual = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId,
      });

      expect(refusedManual).toEqual({
        errorCode: 'ALREADY_REVIEWED',
        message: 'This study has already been reviewed.',
        status: 'failed',
      });
      expect(manual?.body).toBe('## Main points\n\nHand-edited study.');

      await t.run(async (ctx) => {
        if (!manual) {
          throw new Error('expected a study');
        }

        await ctx.db.patch(manual._id, {
          status: 'published',
        });
      });

      const refusedPublished = await asAdmin.action(
        api.talkFeatures.generateStudy,
        { talkId }
      );
      const published = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId,
      });

      expect(refusedPublished).toEqual({
        errorCode: 'ALREADY_REVIEWED',
        message: 'This study has already been reviewed.',
        status: 'failed',
      });
      expect(published?.body).toBe(manual?.body);
    } finally {
      talkStudyGenerator.generate = previousGenerate;

      if (previousKey === undefined) {
        delete process.env.AI_GATEWAY_API_KEY;
      } else {
        process.env.AI_GATEWAY_API_KEY = previousKey;
      }
    }
  });
});
