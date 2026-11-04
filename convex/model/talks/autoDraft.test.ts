import { vi } from 'vitest';

import { api, internal } from '../../_generated/api';
import { createConvexTest, signInAs } from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { talkStudyGenerator } from '../talkFeatures/study/generate';
import { talkSummaryGenerator } from './summaryGenerate';
import { insertTalk } from './test.factory';
import { talkTranscriptFetcher } from './transcriptFetch';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';
const AUDIO_URL = 'https://example.com/talk.mp3';
const GENERATED_SUMMARY = 'A generated draft summary of the talk.';
const GENERATED_STUDY = '## Main points\n\nA generated study draft.';
const FETCHED_TRANSCRIPT = 'Fetched transcript for the new talk.';

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

describe('auto draft', () => {
  it('fetches the transcript, then drafts a summary and study', async () => {
    vi.useFakeTimers();
    const previousFetch = talkTranscriptFetcher.fetch;
    const previousStudy = talkStudyGenerator.generate;
    const previousSummary = talkSummaryGenerator.generate;
    const previousKey = process.env.AI_GATEWAY_API_KEY;

    talkTranscriptFetcher.fetch = () =>
      Promise.resolve({
        status: 'success',
        text: FETCHED_TRANSCRIPT,
      });
    talkSummaryGenerator.generate = () =>
      Promise.resolve({
        flags: [],
        summary: GENERATED_SUMMARY,
      });
    talkStudyGenerator.generate = () => Promise.resolve(GENERATED_STUDY);
    process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

    try {
      const { asAdmin, speakerId, t } = await seedAdmin();
      const talkId = await asAdmin.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        speakerId,
        title: 'New YouTube Talk',
      });

      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const saved = await t.run(async (ctx) => {
        const talk = await ctx.db.get('talks', talkId);
        const transcript = await ctx.db
          .query('talkTranscripts')
          .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
          .unique();
        const study = await ctx.db
          .query('talkFeatures')
          .withIndex('by_talkId_and_kind', (q) =>
            q.eq('talkId', talkId).eq('kind', 'study')
          )
          .unique();

        return { study, talk, transcript };
      });

      expect(saved.transcript?.text).toBe(FETCHED_TRANSCRIPT);
      expect(saved.talk?.autoDraft).toBeUndefined();
      expect(saved.talk).toEqual(
        expect.objectContaining({
          status: 'backlog',
          summary: GENERATED_SUMMARY,
        })
      );
      expect(saved.study).toEqual(
        expect.objectContaining({
          body: GENERATED_STUDY,
          status: 'draft',
        })
      );
      expect(saved.study?.manuallyEditedAt).toBeUndefined();
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
  });

  it('skips transcript, summary, and study content that already exists', async () => {
    vi.useFakeTimers();
    const previousFetch = talkTranscriptFetcher.fetch;
    const previousStudy = talkStudyGenerator.generate;
    const previousSummary = talkSummaryGenerator.generate;
    let fetchCalls = 0;
    let studyCalls = 0;
    let summaryCalls = 0;

    talkTranscriptFetcher.fetch = () => {
      fetchCalls += 1;

      return Promise.resolve({
        status: 'success',
        text: 'Should not replace the transcript.',
      });
    };
    talkSummaryGenerator.generate = () => {
      summaryCalls += 1;

      return Promise.resolve({
        flags: [],
        summary: 'Should not replace the summary.',
      });
    };
    talkStudyGenerator.generate = () => {
      studyCalls += 1;

      return Promise.resolve('Should not replace the study.');
    };

    try {
      const { asAdmin, speakerId, t } = await seedAdmin();
      const talkId = await asAdmin.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        speakerId,
        title: 'Already Drafted Talk',
      });

      await t.run(async (ctx) => {
        await ctx.db.patch(talkId, {
          summary: 'Hand-written summary.',
          summaryManuallyEditedAt: Date.now(),
        });
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
          manuallyEditedAt: Date.now(),
          status: 'published',
          talkId,
          updatedAt: Date.now(),
        });
      });
      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const saved = await t.run(async (ctx) => {
        const talk = await ctx.db.get('talks', talkId);
        const transcript = await ctx.db
          .query('talkTranscripts')
          .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
          .unique();
        const study = await ctx.db
          .query('talkFeatures')
          .withIndex('by_talkId_and_kind', (q) =>
            q.eq('talkId', talkId).eq('kind', 'study')
          )
          .unique();

        return { study, talk, transcript };
      });

      expect(fetchCalls).toBe(0);
      expect(summaryCalls).toBe(0);
      expect(studyCalls).toBe(0);
      expect(saved.transcript?.text).toBe('Hand-written transcript.');
      expect(saved.talk?.summary).toBe('Hand-written summary.');
      expect(saved.study).toEqual(
        expect.objectContaining({
          body: 'Hand-written study.',
          status: 'published',
        })
      );
    } finally {
      talkTranscriptFetcher.fetch = previousFetch;
      talkStudyGenerator.generate = previousStudy;
      talkSummaryGenerator.generate = previousSummary;
      vi.useRealTimers();
    }
  });

  it('drafts only the missing study and does not overwrite an existing summary', async () => {
    const previousStudy = talkStudyGenerator.generate;
    const previousSummary = talkSummaryGenerator.generate;
    const previousKey = process.env.AI_GATEWAY_API_KEY;
    let studyCalls = 0;
    let summaryCalls = 0;

    talkSummaryGenerator.generate = () => {
      summaryCalls += 1;

      return Promise.resolve({
        flags: [],
        summary: 'Should not replace the summary.',
      });
    };
    talkStudyGenerator.generate = () => {
      studyCalls += 1;

      return Promise.resolve(GENERATED_STUDY);
    };
    process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

    try {
      const { speakerId, t } = await seedAdmin();
      const talkId = await t.run(async (ctx) => {
        const id = await insertTalk(ctx, {
          mediaUrl: MEDIA_URL,
          speakerId,
          status: 'backlog',
          summary: 'Existing summary.',
        });

        await ctx.db.insert('talkTranscripts', {
          source: 'youtube_captions',
          status: 'done',
          talkId: id,
          text: 'Existing transcript.',
        });

        return id;
      });

      await t.action(internal.talks.draftTalkSummaryAndStudy, { talkId });
      talkStudyGenerator.generate = () =>
        Promise.resolve('A second generated study.');
      await t.action(internal.talks.draftTalkSummaryAndStudy, { talkId });

      const saved = await t.run(async (ctx) => {
        const talk = await ctx.db.get('talks', talkId);
        const study = await ctx.db
          .query('talkFeatures')
          .withIndex('by_talkId_and_kind', (q) =>
            q.eq('talkId', talkId).eq('kind', 'study')
          )
          .unique();

        return { study, talk };
      });

      expect(summaryCalls).toBe(0);
      expect(studyCalls).toBe(1);
      expect(saved.talk?.summary).toBe('Existing summary.');
      expect(saved.talk?.status).toBe('backlog');
      expect(saved.study).toEqual(
        expect.objectContaining({
          body: GENERATED_STUDY,
          status: 'draft',
        })
      );
    } finally {
      talkStudyGenerator.generate = previousStudy;
      talkSummaryGenerator.generate = previousSummary;

      if (previousKey === undefined) {
        delete process.env.AI_GATEWAY_API_KEY;
      } else {
        process.env.AI_GATEWAY_API_KEY = previousKey;
      }
    }
  });

  it('records a transcript failure and does not draft the summary or study', async () => {
    vi.useFakeTimers();
    const previousFetch = talkTranscriptFetcher.fetch;
    const previousStudy = talkStudyGenerator.generate;
    const previousSummary = talkSummaryGenerator.generate;
    let studyCalls = 0;
    let summaryCalls = 0;

    talkTranscriptFetcher.fetch = () =>
      Promise.resolve({
        errorCode: 'NO_CAPTIONS',
        message: 'No captions are available for this talk.',
        status: 'failed',
      });
    talkSummaryGenerator.generate = () => {
      summaryCalls += 1;

      return Promise.resolve({ flags: [], summary: GENERATED_SUMMARY });
    };
    talkStudyGenerator.generate = () => {
      studyCalls += 1;

      return Promise.resolve(GENERATED_STUDY);
    };

    try {
      const { asAdmin, speakerId, t } = await seedAdmin();
      const talkId = await asAdmin.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        speakerId,
        title: 'No Captions Talk',
      });

      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const saved = await t.run(async (ctx) => {
        const talk = await ctx.db.get('talks', talkId);
        const fetch = await ctx.db
          .query('talkTranscriptFetches')
          .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
          .first();
        const study = await ctx.db
          .query('talkFeatures')
          .withIndex('by_talkId_and_kind', (q) =>
            q.eq('talkId', talkId).eq('kind', 'study')
          )
          .unique();

        return { fetch, study, talk };
      });

      expect(summaryCalls).toBe(0);
      expect(studyCalls).toBe(0);
      expect(saved.fetch).toEqual(
        expect.objectContaining({
          errorCode: 'NO_CAPTIONS',
          message: 'No captions are available for this talk.',
          status: 'failed',
        })
      );
      expect(saved.talk?.summary).toBeUndefined();
      expect(saved.talk?.autoDraft).toBeUndefined();
      expect(saved.study).toBeNull();
    } finally {
      talkTranscriptFetcher.fetch = previousFetch;
      talkStudyGenerator.generate = previousStudy;
      talkSummaryGenerator.generate = previousSummary;
      vi.useRealTimers();
    }
  });

  it('records a summary failure and still drafts the study', async () => {
    vi.useFakeTimers();
    const previousFetch = talkTranscriptFetcher.fetch;
    const previousStudy = talkStudyGenerator.generate;
    const previousSummary = talkSummaryGenerator.generate;
    const previousKey = process.env.AI_GATEWAY_API_KEY;

    talkTranscriptFetcher.fetch = () =>
      Promise.resolve({
        status: 'success',
        text: FETCHED_TRANSCRIPT,
      });
    talkSummaryGenerator.generate = () => Promise.reject(new Error('boom'));
    talkStudyGenerator.generate = () => Promise.resolve(GENERATED_STUDY);
    process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

    try {
      const { asAdmin, speakerId, t } = await seedAdmin();
      const talkId = await asAdmin.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        speakerId,
        title: 'Summary Failed Talk',
      });

      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const saved = await t.run(async (ctx) => {
        const talk = await ctx.db.get('talks', talkId);
        const study = await ctx.db
          .query('talkFeatures')
          .withIndex('by_talkId_and_kind', (q) =>
            q.eq('talkId', talkId).eq('kind', 'study')
          )
          .unique();

        return { study, talk };
      });

      expect(saved.talk?.summary).toBeUndefined();
      expect(saved.talk?.autoDraft).toEqual({
        summaryMessage: 'Summary service returned an error.',
        summaryStatus: 'failed',
      });
      expect(saved.study).toEqual(
        expect.objectContaining({
          body: GENERATED_STUDY,
          status: 'draft',
        })
      );
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
  });

  it('does not draft a talk without a YouTube URL', async () => {
    const { asAdmin, speakerId, t } = await seedAdmin();
    const talkId = await asAdmin.mutation(api.talks.createTalk, {
      mediaUrl: AUDIO_URL,
      speakerId,
      title: 'Audio Talk',
    });
    const saved = await t.run(async (ctx) => {
      const fetches = await ctx.db
        .query('talkTranscriptFetches')
        .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
        .collect();
      const scheduled = await ctx.db.system
        .query('_scheduled_functions')
        .collect();

      return { fetches, scheduled };
    });

    expect(saved.fetches).toHaveLength(0);
    expect(saved.scheduled).toHaveLength(0);
  });
});
