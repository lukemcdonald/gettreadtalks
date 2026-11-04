import type { Id } from '../../_generated/dataModel';

import { vi } from 'vitest';

import { api, internal } from '../../_generated/api';
import { createConvexTest, signInAs } from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { talkStudyGenerator } from '../talkFeatures/study/generate';
import { talkSummaryGenerator } from './summaryGenerate';
import { insertTalk } from './test.factory';
import { talkTranscriptFetcher } from './transcriptFetch';

const AUDIO_URL = 'https://example.com/talk.mp3';
const FETCHED_TRANSCRIPT = 'Fetched transcript.';
const GENERATED_STUDY = 'Generated study draft.';
const GENERATED_SUMMARY = 'Generated summary draft.';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

type ConvexTest = ReturnType<typeof createConvexTest>;

async function seedAdmin() {
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

async function loadDraft(t: ConvexTest, talkId: Id<'talks'>) {
  return await t.run(async (ctx) => ({
    study: await ctx.db
      .query('talkFeatures')
      .withIndex('by_talkId_and_kind', (q) =>
        q.eq('talkId', talkId).eq('kind', 'study')
      )
      .unique(),
    talk: await ctx.db.get('talks', talkId),
    transcript: await ctx.db
      .query('talkTranscripts')
      .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
      .unique(),
  }));
}

async function withDraftMocks(
  run: (seed: Awaited<ReturnType<typeof seedAdmin>>) => Promise<void>
) {
  vi.useFakeTimers();
  const previousFetch = talkTranscriptFetcher.fetch;
  const previousKey = process.env.AI_GATEWAY_API_KEY;
  const previousStudy = talkStudyGenerator.generate;
  const previousSummary = talkSummaryGenerator.generate;

  talkTranscriptFetcher.fetch = () =>
    Promise.resolve({ status: 'success', text: FETCHED_TRANSCRIPT });
  talkStudyGenerator.generate = () => Promise.resolve(GENERATED_STUDY);
  talkSummaryGenerator.generate = () =>
    Promise.resolve({ flags: [], summary: GENERATED_SUMMARY });
  process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

  try {
    await run(await seedAdmin());
  } finally {
    talkTranscriptFetcher.fetch = previousFetch;
    talkStudyGenerator.generate = previousStudy;
    talkSummaryGenerator.generate = previousSummary;
    vi.useRealTimers();

    if (previousKey === undefined) {
      delete process.env.AI_GATEWAY_API_KEY;
    } else {
      process.env.AI_GATEWAY_API_KEY = previousKey;
    }
  }
}

async function createTalk(
  asAdmin: Awaited<ReturnType<typeof seedAdmin>>['asAdmin'],
  speakerId: Awaited<ReturnType<typeof seedAdmin>>['speakerId'],
  title: string,
  mediaUrl = YOUTUBE_URL
) {
  return await asAdmin.mutation(api.talks.createTalk, {
    mediaUrl,
    speakerId,
    title,
  });
}

describe('auto draft', () => {
  it('drafts a YouTube talk and ignores other media', async () => {
    await withDraftMocks(async ({ asAdmin, speakerId, t }) => {
      const youtubeId = await createTalk(asAdmin, speakerId, 'YouTube Talk');
      const audioId = await createTalk(
        asAdmin,
        speakerId,
        'Audio Talk',
        AUDIO_URL
      );

      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const youtube = await loadDraft(t, youtubeId);
      const audio = await loadDraft(t, audioId);

      expect(youtube.transcript?.text).toBe(FETCHED_TRANSCRIPT);
      expect(youtube.talk?.summary).toBe(GENERATED_SUMMARY);
      expect(youtube.talk?.status).toBe('backlog');
      expect(youtube.study).toMatchObject({
        body: GENERATED_STUDY,
        status: 'draft',
      });
      expect(audio.transcript).toBeNull();
      expect(audio.talk?.summary).toBeUndefined();
      expect(audio.study).toBeNull();
    });
  });

  it('does not overwrite an existing transcript, summary, or study', async () => {
    await withDraftMocks(async ({ asAdmin, speakerId, t }) => {
      talkTranscriptFetcher.fetch = () =>
        Promise.resolve({ status: 'success', text: 'Replacement transcript.' });
      talkSummaryGenerator.generate = () =>
        Promise.resolve({ flags: [], summary: 'Replacement summary.' });
      talkStudyGenerator.generate = () => Promise.resolve('Replacement study.');
      const talkId = await createTalk(asAdmin, speakerId, 'Existing Talk');

      await t.run(async (ctx) => {
        await ctx.db.patch(talkId, { summary: 'Hand-written summary.' });
        await ctx.db.insert('talkTranscripts', {
          source: 'manual',
          status: 'done',
          talkId,
          text: 'Hand-written transcript.',
        });
        await ctx.db.insert('talkFeatures', {
          body: 'Hand-written study.',
          generatedAt: Date.now(),
          kind: 'study',
          status: 'draft',
          talkId,
          updatedAt: Date.now(),
        });
      });
      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const saved = await loadDraft(t, talkId);

      expect(saved.transcript?.text).toBe('Hand-written transcript.');
      expect(saved.talk?.summary).toBe('Hand-written summary.');
      expect(saved.study?.body).toBe('Hand-written study.');
      expect(saved.study?.status).toBe('draft');
    });
  });

  it('stops when the transcript fetch fails', async () => {
    await withDraftMocks(async ({ asAdmin, speakerId, t }) => {
      talkTranscriptFetcher.fetch = () =>
        Promise.resolve({
          errorCode: 'NO_CAPTIONS',
          message: 'No captions are available for this talk.',
          status: 'failed',
        });
      const talkId = await createTalk(asAdmin, speakerId, 'No Captions');

      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const saved = await loadDraft(t, talkId);

      expect(saved.transcript).toBeNull();
      expect(saved.talk?.summary).toBeUndefined();
      expect(saved.study).toBeNull();
    });
  });

  it('drafts the study when summary generation fails', async () => {
    await withDraftMocks(async ({ asAdmin, speakerId, t }) => {
      talkSummaryGenerator.generate = () => Promise.reject(new Error('boom'));
      const talkId = await createTalk(asAdmin, speakerId, 'Summary Failed');

      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const saved = await loadDraft(t, talkId);

      expect(saved.talk?.summary).toBeUndefined();
      expect(saved.study).toMatchObject({
        body: GENERATED_STUDY,
        status: 'draft',
      });
    });
  });

  it('clears a stored failure when that step is saved or skipped', async () => {
    const { asAdmin, speakerId, t } = await seedAdmin();
    const talkId = await t.run(async (ctx) => {
      const id = await insertTalk(ctx, {
        speakerId,
        status: 'backlog',
        summary: 'Kept summary.',
      });

      await ctx.db.patch(id, {
        draftStudy: 'Study failed.',
        draftSummary: 'Summary failed.',
      });
      await ctx.db.insert('talkFeatures', {
        body: 'Kept study.',
        generatedAt: Date.now(),
        kind: 'study',
        status: 'draft',
        talkId: id,
        updatedAt: Date.now(),
      });

      return id;
    });

    await asAdmin.mutation(api.talks.updateTalkSummary, {
      summary: 'Saved summary.',
      talkId,
    });
    await asAdmin.mutation(api.talkFeatures.updateTalkFeature, {
      body: 'Saved study.',
      kind: 'study',
      status: 'draft',
      talkId,
    });

    const saved = await t.run(async (ctx) => await ctx.db.get('talks', talkId));

    expect(saved?.summary).toBe('Saved summary.');
    expect(saved?.draftSummary).toBeUndefined();
    expect(saved?.draftStudy).toBeUndefined();

    await t.run(async (ctx) => {
      await ctx.db.patch(talkId, {
        draftStudy: 'Study failed.',
        draftSummary: 'Summary failed.',
      });
    });
    await t.action(internal.talks.draftTalkSummaryAndStudy, { talkId });

    const skipped = await t.run(
      async (ctx) => await ctx.db.get('talks', talkId)
    );

    expect(skipped?.summary).toBe('Saved summary.');
    expect(skipped?.draftSummary).toBeUndefined();
    expect(skipped?.draftStudy).toBeUndefined();
  });
});
