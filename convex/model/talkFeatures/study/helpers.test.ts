import { describe, expect, it } from 'vitest';

import {
  TALK_SUMMARY_MODEL_INPUT_USD_PER_TOKEN,
  TALK_SUMMARY_MODEL_OUTPUT_USD_PER_TOKEN,
} from '../../talks/summary/prompt';
import { TALK_DRAFT_PENDING } from '../../talks/validators';
import {
  STUDY_BACKFILL_DEFAULT_LIMIT,
  STUDY_BACKFILL_MAX_LIMIT,
  STUDY_GENERATE_OUTPUT_TOKENS,
  estimateStudyGenerateCost,
  estimateStudyInputTokens,
  getStudyBackfillLimit,
  isStudyBackfillEligible,
  paginateStudyBackfillTalks,
} from './helpers';

describe('isStudyBackfillEligible', () => {
  const eligible = {
    feature: null,
    status: 'published',
    transcript: 'A stored transcript.',
  };

  it('accepts a published talk with a transcript and no study', () => {
    expect(isStudyBackfillEligible(eligible)).toBe(true);
  });

  it('rejects unpublished talks, empty transcripts, pending drafts, and existing studies', () => {
    expect(
      isStudyBackfillEligible({
        ...eligible,
        status: 'backlog',
      })
    ).toBe(false);
    expect(
      isStudyBackfillEligible({
        ...eligible,
        transcript: '   ',
      })
    ).toBe(false);
    expect(
      isStudyBackfillEligible({
        ...eligible,
        draftStudy: TALK_DRAFT_PENDING,
      })
    ).toBe(false);
    expect(
      isStudyBackfillEligible({
        ...eligible,
        feature: {
          status: 'draft',
        },
      })
    ).toBe(false);
    expect(
      isStudyBackfillEligible({
        ...eligible,
        feature: {
          manuallyEditedAt: Date.now(),
          status: 'draft',
        },
      })
    ).toBe(false);
  });
});

describe('getStudyBackfillLimit', () => {
  it('defaults, clamps to the batch max, and keeps at least one', () => {
    expect(getStudyBackfillLimit(undefined)).toBe(STUDY_BACKFILL_DEFAULT_LIMIT);
    expect(getStudyBackfillLimit(Number.NaN)).toBe(
      STUDY_BACKFILL_DEFAULT_LIMIT
    );
    expect(getStudyBackfillLimit(0)).toBe(1);
    expect(getStudyBackfillLimit(STUDY_BACKFILL_MAX_LIMIT + 5)).toBe(
      STUDY_BACKFILL_MAX_LIMIT
    );
    expect(getStudyBackfillLimit(3.9)).toBe(3);
  });
});

describe('estimateStudyGenerateCost', () => {
  it('uses the study prompt and the same gateway rates as generation', () => {
    const talk = {
      scripture: 'Luke 15:11-32',
      speaker: 'John Owen',
      title: 'Grace Abounding',
      transcriptChars: 8000,
    };
    const cost = estimateStudyGenerateCost([talk, talk]);
    const inputTokens = estimateStudyInputTokens(talk) * 2;
    const outputTokens = STUDY_GENERATE_OUTPUT_TOKENS * 2;

    expect(cost.estimatedInputTokens).toBe(inputTokens);
    expect(cost.estimatedOutputTokens).toBe(outputTokens);
    expect(cost.estimatedCostUsd).toBe(
      inputTokens * TALK_SUMMARY_MODEL_INPUT_USD_PER_TOKEN +
        outputTokens * TALK_SUMMARY_MODEL_OUTPUT_USD_PER_TOKEN
    );
  });
});

describe('paginateStudyBackfillTalks', () => {
  const orderedIds = ['talk-a', 'talk-b', 'talk-c'];
  const talks = [
    { talkId: 'talk-a' },
    { talkId: 'talk-b' },
    { talkId: 'talk-c' },
  ];

  it('pages after a talk id even when that talk is no longer eligible', () => {
    const first = paginateStudyBackfillTalks({
      cursor: null,
      eligible: talks,
      limit: 2,
      orderedIds,
    });

    expect(first).toEqual({
      continueCursor: 'talk-b',
      isDone: false,
      page: [{ talkId: 'talk-a' }, { talkId: 'talk-b' }],
    });
    expect(
      paginateStudyBackfillTalks({
        cursor: first.continueCursor,
        eligible: talks,
        limit: 2,
        orderedIds,
      })
    ).toEqual({
      continueCursor: '',
      isDone: true,
      page: [{ talkId: 'talk-c' }],
    });
    expect(
      paginateStudyBackfillTalks({
        cursor: first.continueCursor,
        eligible: [{ talkId: 'talk-a' }, { talkId: 'talk-c' }],
        limit: 2,
        orderedIds,
      })
    ).toEqual({
      continueCursor: '',
      isDone: true,
      page: [{ talkId: 'talk-c' }],
    });
  });
});
