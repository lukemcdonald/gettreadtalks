import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import { ErrorCodes } from '../../lib/errors';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';
import { talkSummaryGenerator } from './summaryGenerate';

const GENERATED_SUMMARY = 'A generated draft summary of the talk.';
const GENERATED_FLAGS = ['Scripture field does not match the sermon.'];

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
    text: 'Cleaned transcript for summary generation.',
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

describe('generateTalkSummary', () => {
  it('guards admin, saves a draft only, and refuses a published study', async () => {
    const { asAdmin, asMember, t, talkId } = await seedTalkWithTranscript();
    const previousKey = process.env.AI_GATEWAY_API_KEY;
    const previousGenerate = talkSummaryGenerator.generate;

    talkSummaryGenerator.generate = () =>
      Promise.resolve({
        flags: GENERATED_FLAGS,
        summary: GENERATED_SUMMARY,
      });
    process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

    try {
      await expect(
        t.action(api.talks.generateTalkSummary, { talkId })
      ).rejects.toMatchObject({
        data: {
          errorCode: ErrorCodes.AUTH_REQUIRED,
        },
      });
      await expect(
        asMember.action(api.talks.generateTalkSummary, { talkId })
      ).rejects.toMatchObject({
        data: {
          errorCode: ErrorCodes.FORBIDDEN,
        },
      });

      const created = await asAdmin.action(api.talks.generateTalkSummary, {
        talkId,
      });

      expect(created).toEqual({
        flags: GENERATED_FLAGS,
        status: 'success',
        summary: GENERATED_SUMMARY,
      });

      const draft = await asAdmin.query(api.talks.getTalkStudy, { talkId });

      expect(draft).toEqual(
        expect.objectContaining({
          studyStatus: 'draft',
          summary: GENERATED_SUMMARY,
        })
      );
      expect(draft?.manuallyEditedAt).toBeUndefined();

      await asAdmin.mutation(api.talks.updateTalkStudy, {
        studyStatus: 'published',
        summary: 'Hand-edited published summary.',
        talkId,
      });

      const refused = await asAdmin.action(api.talks.generateTalkSummary, {
        talkId,
      });
      const published = await asAdmin.query(api.talks.getTalkStudy, {
        talkId,
      });

      expect(refused).toEqual({
        errorCode: 'already_reviewed',
        message: 'This study has already been reviewed.',
        status: 'failed',
      });
      expect(published).toEqual(
        expect.objectContaining({
          studyStatus: 'published',
          summary: 'Hand-edited published summary.',
        })
      );
    } finally {
      talkSummaryGenerator.generate = previousGenerate;

      if (previousKey === undefined) {
        delete process.env.AI_GATEWAY_API_KEY;
      } else {
        process.env.AI_GATEWAY_API_KEY = previousKey;
      }
    }
  });
});
