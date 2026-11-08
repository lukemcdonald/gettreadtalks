import type { Id } from '../../_generated/dataModel';

import { describe, expect, it } from 'vitest';

import {
  isEligibleStudyDraft,
  PUBLISH_STUDY_DRAFTS_MAX,
  toEligibleStudyDraftIds,
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
  it('keeps nonempty drafts, skips the rest, and caps the list', () => {
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
    expect(toEligibleStudyDraftIds(features, 1)).toEqual(['talkFeatures:one']);
    expect(PUBLISH_STUDY_DRAFTS_MAX).toBe(1000);
  });
});
