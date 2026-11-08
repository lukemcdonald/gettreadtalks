import type { Id } from '../../_generated/dataModel';

import { describe, expect, it } from 'vitest';

import {
  isEligibleStudyDraft,
  toEligibleStudyDraftIds,
  toTalkFeatureProgress,
} from './helpers';

describe('isEligibleStudyDraft', () => {
  const eligible = {
    body: '## Main points\n\nA study.',
    kind: 'study',
    status: 'draft',
  };

  it('accepts a nonempty study draft', () => {
    expect(isEligibleStudyDraft(eligible)).toBe(true);
  });

  it('rejects empty, published, and non-study rows', () => {
    expect(isEligibleStudyDraft({ ...eligible, body: '   ' })).toBe(false);
    expect(isEligibleStudyDraft({ ...eligible, body: '' })).toBe(false);
    expect(isEligibleStudyDraft({ ...eligible, status: 'published' })).toBe(
      false
    );
    expect(isEligibleStudyDraft({ ...eligible, kind: 'summary' })).toBe(false);
  });
});

describe('toEligibleStudyDraftIds', () => {
  it('keeps nonempty drafts and skips the rest', () => {
    const features = [
      {
        _id: 'talkFeatures:empty' as Id<'talkFeatures'>,
        body: ' ',
        kind: 'study',
        status: 'draft',
      },
      {
        _id: 'talkFeatures:one' as Id<'talkFeatures'>,
        body: '## Main points\n\nOne.',
        kind: 'study',
        status: 'draft',
      },
      {
        _id: 'talkFeatures:published' as Id<'talkFeatures'>,
        body: '## Main points\n\nPublished.',
        kind: 'study',
        status: 'published',
      },
      {
        _id: 'talkFeatures:two' as Id<'talkFeatures'>,
        body: '## Main points\n\nTwo.',
        kind: 'study',
        status: 'draft',
      },
    ];

    expect(toEligibleStudyDraftIds(features)).toEqual([
      'talkFeatures:one',
      'talkFeatures:two',
    ]);
  });
});

describe('toTalkFeatureProgress', () => {
  it('returns hasBody and status without the study text', () => {
    expect(
      toTalkFeatureProgress({
        body: '## Main points\n\nA study.',
        status: 'draft',
      })
    ).toEqual({
      hasBody: true,
      status: 'draft',
    });
    expect(
      toTalkFeatureProgress({
        body: '   ',
        status: 'published',
      })
    ).toEqual({
      hasBody: false,
      status: 'published',
    });
    expect(toTalkFeatureProgress(null)).toBeNull();
  });
});
