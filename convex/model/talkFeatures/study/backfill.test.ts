import { describe, expect, it } from 'vitest';

import { api } from '../../../_generated/api';
import { ErrorCodes } from '../../../lib/errors';
import { createConvexTest, signInAs } from '../../../test.setup';
import { insertSpeaker } from '../../speakers/test.factory';
import { insertTalk, insertTalkTranscript } from '../../talks/test.factory';
import { TALK_DRAFT_PENDING } from '../../talks/validators';
import { studyBackfillGenerator } from './backfill';
import { talkStudyGenerator } from './generate';
import { estimateStudyGenerateCost } from './helpers';

const GENERATED_STUDY_BODY = '## Main points\n\nGenerated backfill study.';

async function seedBackfillCatalog() {
  const t = createConvexTest();
  const ids = await t.run(async (ctx) => {
    const speakerId = await insertSpeaker(ctx, {
      firstName: 'John',
      lastName: 'Owen',
      slug: 'john-owen',
    });
    const eligibleA = await insertTalk(ctx, {
      publishedAt: 3,
      slug: 'eligible-a',
      speakerId,
      title: 'Eligible A',
    });
    const eligibleB = await insertTalk(ctx, {
      publishedAt: 2,
      slug: 'eligible-b',
      speakerId,
      title: 'Eligible B',
    });
    const eligibleC = await insertTalk(ctx, {
      publishedAt: 1,
      slug: 'eligible-c',
      speakerId,
      title: 'Eligible C',
    });
    const backlog = await insertTalk(ctx, {
      slug: 'backlog-talk',
      speakerId,
      status: 'backlog',
      title: 'Backlog Talk',
    });
    const pending = await insertTalk(ctx, {
      draftStudy: TALK_DRAFT_PENDING,
      publishedAt: 4,
      slug: 'pending-talk',
      speakerId,
      title: 'Pending Talk',
    });
    const existing = await insertTalk(ctx, {
      publishedAt: 5,
      slug: 'existing-study',
      speakerId,
      title: 'Existing Study',
    });
    const reviewed = await insertTalk(ctx, {
      publishedAt: 6,
      slug: 'reviewed-study',
      speakerId,
      title: 'Reviewed Study',
    });
    await insertTalk(ctx, {
      publishedAt: 7,
      slug: 'no-transcript',
      speakerId,
      title: 'No Transcript',
    });

    await Promise.all(
      [
        backlog,
        eligibleA,
        eligibleB,
        eligibleC,
        existing,
        pending,
        reviewed,
      ].map((talkId) =>
        insertTalkTranscript(ctx, {
          talkId,
          text: `Transcript for ${talkId}`,
        })
      )
    );

    await ctx.db.insert('talkFeatures', {
      body: 'Existing draft study.',
      generatedAt: Date.now(),
      kind: 'study',
      status: 'draft',
      talkId: existing,
      updatedAt: Date.now(),
    });
    await ctx.db.insert('talkFeatures', {
      body: 'Hand-edited study.',
      generatedAt: Date.now(),
      kind: 'study',
      manuallyEditedAt: Date.now(),
      status: 'draft',
      talkId: reviewed,
      updatedAt: Date.now(),
    });

    return {
      eligibleA,
      eligibleB,
      eligibleC,
      existing,
      reviewed,
    };
  });
  const { asUser: asAdmin } = await signInAs(t, {
    email: 'admin@example.test',
    name: 'Admin',
    role: 'admin',
  });

  return {
    asAdmin,
    t,
    ...ids,
  };
}

async function withStudyGenerateStub(run: () => Promise<void>) {
  const previousGenerate = talkStudyGenerator.generate;
  const previousKey = process.env.AI_GATEWAY_API_KEY;

  talkStudyGenerator.generate = () => Promise.resolve(GENERATED_STUDY_BODY);
  process.env.AI_GATEWAY_API_KEY = 'test-gateway-key';

  try {
    await run();
  } finally {
    talkStudyGenerator.generate = previousGenerate;

    if (previousKey === undefined) {
      delete process.env.AI_GATEWAY_API_KEY;
    } else {
      process.env.AI_GATEWAY_API_KEY = previousKey;
    }
  }
}

describe('estimateStudyBackfill', () => {
  it('counts published talks that have transcripts and lack a study draft', async () => {
    const { asAdmin, eligibleA, eligibleB, eligibleC } =
      await seedBackfillCatalog();

    const estimate = await asAdmin.query(
      api.talkFeatures.estimateStudyBackfill,
      {
        limit: 2,
      }
    );
    const expectedBatch = estimateStudyGenerateCost(
      estimate.batch.talks.map((talk) => ({
        scripture: '',
        speaker: 'John Owen',
        title: talk.title,
        transcriptChars: talk.transcriptChars,
      }))
    );
    const withoutSpeaker = estimateStudyGenerateCost(
      estimate.batch.talks.map((talk) => ({
        scripture: '',
        speaker: '',
        title: talk.title,
        transcriptChars: talk.transcriptChars,
      }))
    );

    expect(estimate.total.eligibleCount).toBe(3);
    expect(estimate.batch.talks.map((talk) => talk.talkId)).toEqual([
      eligibleA,
      eligibleB,
    ]);
    expect(estimate.batch.continueCursor).toBe(eligibleB);
    expect(estimate.batch.isDone).toBe(false);
    expect(expectedBatch.estimatedInputTokens).toBeGreaterThan(
      withoutSpeaker.estimatedInputTokens
    );
    expect(estimate.batch.estimatedInputTokens).toBe(
      expectedBatch.estimatedInputTokens
    );
    expect(estimate.batch.estimatedCostUsd).toBe(
      expectedBatch.estimatedCostUsd
    );
    expect(estimate.total.estimatedCostUsd).toBeGreaterThan(
      estimate.batch.estimatedCostUsd
    );

    const nextPage = await asAdmin.query(
      api.talkFeatures.estimateStudyBackfill,
      {
        cursor: estimate.batch.continueCursor,
        limit: 2,
      }
    );

    expect(nextPage.batch.talks.map((talk) => talk.talkId)).toEqual([
      eligibleC,
    ]);
    expect(nextPage.batch.isDone).toBe(true);
  });
});

describe('backfillStudies', () => {
  it('generates a limited batch and leaves remaining talks for the next cursor', async () => {
    const { asAdmin, eligibleA, eligibleB, eligibleC, existing, reviewed } =
      await seedBackfillCatalog();

    await withStudyGenerateStub(async () => {
      const first = await asAdmin.action(api.talkFeatures.backfillStudies, {
        limit: 2,
      });
      const firstA = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId: eligibleA,
      });
      const firstB = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId: eligibleB,
      });
      const firstC = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId: eligibleC,
      });

      expect(first.results).toEqual([
        { status: 'success', talkId: eligibleA, title: 'Eligible A' },
        { status: 'success', talkId: eligibleB, title: 'Eligible B' },
      ]);
      expect(firstA).toEqual(
        expect.objectContaining({
          body: GENERATED_STUDY_BODY,
          status: 'draft',
        })
      );
      expect(firstB?.body).toBe(GENERATED_STUDY_BODY);
      expect(firstC).toBeNull();
      expect(firstA?.manuallyEditedAt).toBeUndefined();

      const remaining = await asAdmin.query(
        api.talkFeatures.estimateStudyBackfill,
        {
          cursor: first.continueCursor,
          limit: 2,
        }
      );
      const second = await asAdmin.action(api.talkFeatures.backfillStudies, {
        cursor: first.continueCursor,
        limit: 2,
      });
      const secondC = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId: eligibleC,
      });

      expect(remaining.total.eligibleCount).toBe(1);
      expect(remaining.batch.talks.map((talk) => talk.talkId)).toEqual([
        eligibleC,
      ]);
      expect(second.results).toEqual([
        { status: 'success', talkId: eligibleC, title: 'Eligible C' },
      ]);
      expect(secondC?.body).toBe(GENERATED_STUDY_BODY);

      const existingStudy = await asAdmin.query(
        api.talkFeatures.getTalkFeature,
        {
          kind: 'study',
          talkId: existing,
        }
      );
      const reviewedStudy = await asAdmin.query(
        api.talkFeatures.getTalkFeature,
        {
          kind: 'study',
          talkId: reviewed,
        }
      );

      expect(existingStudy?.body).toBe('Existing draft study.');
      expect(reviewedStudy?.body).toBe('Hand-edited study.');
    });
  });

  it('keeps the cursor on unprocessed talks when the gateway key is missing', async () => {
    const { asAdmin, eligibleA, eligibleB } = await seedBackfillCatalog();
    const previousKey = process.env.AI_GATEWAY_API_KEY;

    delete process.env.AI_GATEWAY_API_KEY;

    try {
      const first = await asAdmin.action(api.talkFeatures.backfillStudies, {
        limit: 2,
      });
      const remaining = await asAdmin.query(
        api.talkFeatures.estimateStudyBackfill,
        {
          cursor: first.continueCursor,
          limit: 2,
        }
      );

      expect(first).toEqual({
        continueCursor: '',
        isDone: false,
        results: [
          {
            errorCode: 'TOKEN_MISSING',
            status: 'failed',
            talkId: eligibleA,
            title: 'Eligible A',
          },
        ],
      });
      expect(remaining.batch.talks.map((talk) => talk.talkId)).toEqual([
        eligibleA,
        eligibleB,
      ]);
    } finally {
      if (previousKey === undefined) {
        delete process.env.AI_GATEWAY_API_KEY;
      } else {
        process.env.AI_GATEWAY_API_KEY = previousKey;
      }
    }
  });

  it('does not retry a failed talk after the cursor advances past it', async () => {
    const { asAdmin, eligibleA, eligibleB, eligibleC } =
      await seedBackfillCatalog();

    await withStudyGenerateStub(async () => {
      talkStudyGenerator.generate = ({ title }) => {
        if (title === 'Eligible A') {
          return Promise.reject(new Error('upstream'));
        }

        return Promise.resolve(GENERATED_STUDY_BODY);
      };

      const first = await asAdmin.action(api.talkFeatures.backfillStudies, {
        limit: 2,
      });
      const second = await asAdmin.action(api.talkFeatures.backfillStudies, {
        cursor: first.continueCursor,
        limit: 2,
      });
      const studyA = await asAdmin.query(api.talkFeatures.getTalkFeature, {
        kind: 'study',
        talkId: eligibleA,
      });

      expect(first.results).toEqual([
        {
          errorCode: 'UPSTREAM_ERROR',
          status: 'failed',
          talkId: eligibleA,
          title: 'Eligible A',
        },
        { status: 'success', talkId: eligibleB, title: 'Eligible B' },
      ]);
      expect(first.continueCursor).toBe(eligibleB);
      expect(second.results).toEqual([
        { status: 'success', talkId: eligibleC, title: 'Eligible C' },
      ]);
      expect(studyA).toBeNull();
    });
  });

  it('keeps earlier successes when generating a later talk throws', async () => {
    const { asAdmin, eligibleA, eligibleB, eligibleC } =
      await seedBackfillCatalog();

    await withStudyGenerateStub(async () => {
      const previousGenerate = studyBackfillGenerator.generate;

      studyBackfillGenerator.generate = async (ctx, talkId) => {
        if (talkId === eligibleB) {
          throw new Error('boom');
        }

        return await previousGenerate(ctx, talkId);
      };

      try {
        const first = await asAdmin.action(api.talkFeatures.backfillStudies, {
          limit: 3,
        });
        const studyA = await asAdmin.query(api.talkFeatures.getTalkFeature, {
          kind: 'study',
          talkId: eligibleA,
        });
        const studyB = await asAdmin.query(api.talkFeatures.getTalkFeature, {
          kind: 'study',
          talkId: eligibleB,
        });
        const studyC = await asAdmin.query(api.talkFeatures.getTalkFeature, {
          kind: 'study',
          talkId: eligibleC,
        });

        expect(first.results).toEqual([
          { status: 'success', talkId: eligibleA, title: 'Eligible A' },
          {
            errorCode: ErrorCodes.SERVER_ERROR,
            status: 'failed',
            talkId: eligibleB,
            title: 'Eligible B',
          },
        ]);
        expect(first.continueCursor).toBe(eligibleA);
        expect(first.isDone).toBe(false);
        expect(studyA?.body).toBe(GENERATED_STUDY_BODY);
        expect(studyB).toBeNull();
        expect(studyC).toBeNull();
      } finally {
        studyBackfillGenerator.generate = previousGenerate;
      }
    });
  });
});
