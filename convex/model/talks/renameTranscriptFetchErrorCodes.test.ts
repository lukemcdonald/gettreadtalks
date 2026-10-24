import { describe, expect, it } from 'vitest';

import { api, internal } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  signInAs,
  visibilitySlugs,
} from '../../test.setup';
import { TRANSCRIPT_FETCH_ERROR_CODES } from './transcriptFetchErrorCode';

const LEGACY_ERROR_CODES = [
  'login_required',
  'no_captions',
  'not_youtube',
  'quota_exhausted',
  'rate_limited',
  'token_invalid',
  'token_missing',
  'upstream_error',
] as const;

async function seedPublishedTalk() {
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

  return {
    asAdmin,
    t,
    talk: published.talk,
  };
}

describe('renameTalkTranscriptFetchErrorCodes', () => {
  it('counts leftover lowercase codes without writing on dry run', async () => {
    const { t, talk } = await seedPublishedTalk();

    await t.run(async (ctx) => {
      await Promise.all(
        LEGACY_ERROR_CODES.map((errorCode) =>
          ctx.db.insert('talkTranscriptFetches', {
            checkedAt: Date.now(),
            errorCode,
            message: errorCode,
            status: 'failed',
            talkId: talk._id,
          })
        )
      );
      await ctx.db.insert('talkTranscriptFetches', {
        checkedAt: Date.now(),
        errorCode: TRANSCRIPT_FETCH_ERROR_CODES.RATE_LIMITED,
        message: 'already new',
        status: 'failed',
        talkId: talk._id,
      });
      await ctx.db.insert('talkTranscriptFetches', {
        checkedAt: Date.now(),
        status: 'pending',
        talkId: talk._id,
      });
    });

    const dryRun = await t.mutation(
      internal.talks.renameTalkTranscriptFetchErrorCodes,
      {}
    );

    expect(dryRun).toEqual({
      isDone: false,
      legacyErrorCodes: 8,
      renamed: 0,
      totalFetches: 10,
    });

    const stillLegacy = await t.run(async (ctx) => {
      const fetches = await ctx.db.query('talkTranscriptFetches').collect();

      return fetches.filter((fetch) => fetch.errorCode === 'rate_limited')
        .length;
    });

    expect(stillLegacy).toBe(1);
  });

  it('rewrites leftover codes, then a second run is a no-op', async () => {
    const { asAdmin, t, talk } = await seedPublishedTalk();

    await t.run(async (ctx) => {
      const now = Date.now();

      await ctx.db.insert('talkTranscriptFetches', {
        checkedAt: now,
        errorCode: TRANSCRIPT_FETCH_ERROR_CODES.NO_CAPTIONS,
        message: 'already new',
        status: 'failed',
        talkId: talk._id,
      });

      await Promise.all(
        LEGACY_ERROR_CODES.map((errorCode, index) =>
          ctx.db.insert('talkTranscriptFetches', {
            checkedAt: now + index + 1,
            errorCode,
            message: errorCode,
            status: 'failed',
            talkId: talk._id,
          })
        )
      );
    });

    const missingBefore = await asAdmin.query(
      api.talks.listTalksWithoutTranscript,
      { status: 'all' }
    );
    const publishedBefore = missingBefore.find(
      (item) => item.slug === visibilitySlugs.publishedTalk
    );

    expect(publishedBefore?.lastError?.errorCode).toBe(
      TRANSCRIPT_FETCH_ERROR_CODES.UPSTREAM_ERROR
    );

    const first = await t.mutation(
      internal.talks.renameTalkTranscriptFetchErrorCodes,
      { dryRun: false }
    );

    expect(first).toEqual({
      isDone: true,
      legacyErrorCodes: 0,
      renamed: 8,
      totalFetches: 9,
    });

    const after = await t.run(async (ctx) => {
      const fetches = await ctx.db.query('talkTranscriptFetches').collect();
      const stored = fetches.flatMap((fetch) =>
        fetch.errorCode ? [fetch.errorCode] : []
      );

      return {
        legacy: stored.filter(
          (errorCode) => errorCode === errorCode.toLowerCase()
        ).length,
        stored,
      };
    });

    expect(after.legacy).toBe(0);
    expect(after.stored).toHaveLength(9);
    expect(
      after.stored.filter((errorCode) => errorCode === 'NO_CAPTIONS')
    ).toHaveLength(2);
    expect(new Set(after.stored)).toEqual(
      new Set(Object.values(TRANSCRIPT_FETCH_ERROR_CODES))
    );

    const second = await t.mutation(
      internal.talks.renameTalkTranscriptFetchErrorCodes,
      { dryRun: false }
    );

    expect(second).toEqual({
      isDone: true,
      legacyErrorCodes: 0,
      renamed: 0,
      totalFetches: 9,
    });
  });

  it('stores new codes even when completeTalkTranscriptFetch receives a leftover value', async () => {
    const { t, talk } = await seedPublishedTalk();

    const runId = await t.run(
      async (ctx) =>
        await ctx.db.insert('talkTranscriptFetches', {
          checkedAt: Date.now(),
          status: 'pending',
          talkId: talk._id,
        })
    );

    await t.mutation(internal.talks.completeTalkTranscriptFetch, {
      errorCode: 'rate_limited',
      message: 'Too many transcript requests.',
      runId,
      status: 'failed',
      talkId: talk._id,
    });

    const fetch = await t.run(async (ctx) => await ctx.db.get(runId));

    expect(fetch?.errorCode).toBe(TRANSCRIPT_FETCH_ERROR_CODES.RATE_LIMITED);
  });
});
