import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import { ErrorCodes } from '../../lib/errors';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';
import { talkStudyGenerator } from './studyGenerate';

const GENERATED_MAIN_POINTS = [
  {
    body: 'The father runs before the speech is finished.',
    heading: 'A father who runs',
    references: [{ text: 'Luke 15:20' }],
  },
];

const GENERATED_KEY_PASSAGES = [
  {
    note: 'The father runs to the returning son.',
    reference: { text: 'Luke 15:11-32' },
  },
];

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

describe('generateTalkStudy', () => {
  it('saves a draft and refuses a manually edited or published study', async () => {
    const { asAdmin, asMember, t, talkId } = await seedTalkWithTranscript();
    const previousKey = process.env.AI_GATEWAY_API_KEY;
    const previousGenerate = talkStudyGenerator.generate;

    talkStudyGenerator.generate = () =>
      Promise.resolve({
        keyPassages: GENERATED_KEY_PASSAGES,
        mainPoints: GENERATED_MAIN_POINTS,
      });
    process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

    try {
      await expect(
        t.action(api.talks.generateTalkStudy, { talkId })
      ).rejects.toMatchObject({
        data: {
          errorCode: ErrorCodes.AUTH_REQUIRED,
        },
      });
      await expect(
        asMember.action(api.talks.generateTalkStudy, { talkId })
      ).rejects.toMatchObject({
        data: {
          errorCode: ErrorCodes.FORBIDDEN,
        },
      });

      const created = await asAdmin.action(api.talks.generateTalkStudy, {
        talkId,
      });

      expect(created.status).toBe('success');

      const draft = await asAdmin.query(api.talks.getTalkStudy, { talkId });

      expect(draft).toEqual(
        expect.objectContaining({
          mainPoints: [
            {
              body: 'The father runs before the speech is finished.',
              heading: 'A father who runs',
              references: [{ osis: 'Luke.15.20', text: 'Luke 15:20' }],
            },
          ],
          studyStatus: 'draft',
        })
      );
      expect(draft?.manuallyEditedAt).toBeUndefined();

      await asAdmin.mutation(api.talks.updateTalkStudy, {
        mainPoints: [
          {
            body: 'Hand-edited point body.',
            heading: 'Hand-edited point',
            references: [{ osis: 'Luke.15.20', text: 'Luke 15:20' }],
          },
        ],
        studyStatus: 'draft',
        talkId,
      });

      const refusedManual = await asAdmin.action(api.talks.generateTalkStudy, {
        talkId,
      });
      const manual = await asAdmin.query(api.talks.getTalkStudy, { talkId });

      expect(refusedManual).toEqual({
        errorCode: 'ALREADY_REVIEWED',
        message: 'This study has already been reviewed.',
        status: 'failed',
      });
      expect(manual?.mainPoints).toEqual([
        {
          body: 'Hand-edited point body.',
          heading: 'Hand-edited point',
          references: [{ osis: 'Luke.15.20', text: 'Luke 15:20' }],
        },
      ]);

      await t.run(async (ctx) => {
        if (!manual) {
          throw new Error('expected a study');
        }

        await ctx.db.patch(manual._id, {
          studyStatus: 'published',
        });
      });

      const refusedPublished = await asAdmin.action(
        api.talks.generateTalkStudy,
        { talkId }
      );
      const published = await asAdmin.query(api.talks.getTalkStudy, {
        talkId,
      });

      expect(refusedPublished).toEqual({
        errorCode: 'ALREADY_REVIEWED',
        message: 'This study has already been reviewed.',
        status: 'failed',
      });
      expect(published?.mainPoints).toEqual(manual?.mainPoints);
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
