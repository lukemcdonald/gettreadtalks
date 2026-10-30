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
import { talkTranscriptResolver } from './transcriptFetch';

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
  it('fetches a missing transcript before generating', async () => {
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

    const { asUser: asAdmin } = await signInAs(t, {
      email: 'admin@example.test',
      name: 'Admin',
      role: 'admin',
    });
    const talkId = published.talk._id;
    const fetchedTranscript = 'Fetched transcript for summary generation.';
    const previousFetch = talkTranscriptResolver.resolve;
    const previousGenerate = talkSummaryGenerator.generate;
    const previousKey = process.env.AI_GATEWAY_API_KEY;

    talkTranscriptResolver.resolve = () =>
      Promise.resolve({
        status: 'success',
        text: fetchedTranscript,
      });
    talkSummaryGenerator.generate = () =>
      Promise.resolve({
        flags: [],
        summary: GENERATED_SUMMARY,
      });
    process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

    try {
      const created = await asAdmin.action(api.talks.generateTalkSummary, {
        talkId,
      });

      expect(created).toEqual({
        flags: [],
        status: 'success',
        summary: GENERATED_SUMMARY,
      });

      const loaded = await asAdmin.query(api.talks.getTalkTranscriptText, {
        talkId,
      });

      expect(loaded?.text).toBe(fetchedTranscript);
    } finally {
      talkTranscriptResolver.resolve = previousFetch;
      talkSummaryGenerator.generate = previousGenerate;

      if (previousKey === undefined) {
        delete process.env.AI_GATEWAY_API_KEY;
      } else {
        process.env.AI_GATEWAY_API_KEY = previousKey;
      }
    }
  });

  it('writes the talk summary and refuses to overwrite a manually edited one', async () => {
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

      const generated = await asAdmin.query(api.talks.getTalk, { id: talkId });

      expect(generated).toEqual(
        expect.objectContaining({
          summary: GENERATED_SUMMARY,
        })
      );
      expect(generated?.summaryManuallyEditedAt).toBeUndefined();

      await asAdmin.mutation(api.talks.updateTalkSummary, {
        summary: 'Hand-edited summary.',
        talkId,
      });

      const refused = await asAdmin.action(api.talks.generateTalkSummary, {
        talkId,
      });
      const edited = await asAdmin.query(api.talks.getTalk, {
        id: talkId,
      });

      expect(refused).toEqual({
        errorCode: 'ALREADY_REVIEWED',
        message: 'This summary has already been edited.',
        status: 'failed',
      });
      expect(edited).toEqual(
        expect.objectContaining({
          summary: 'Hand-edited summary.',
        })
      );
      expect(edited?.summaryManuallyEditedAt).toEqual(expect.any(Number));
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
