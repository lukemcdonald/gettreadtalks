import { NO_TRANSCRIPT_SOURCE_MESSAGE } from '@/convex/model/talks/summary/prompt';
import { TALK_DRAFT_PENDING } from '@/convex/model/talks/validators';
import { describe, expect, it } from '@/test';

import {
  getTalkCreateGenerationHint,
  getTalkGenerationStatus,
  getTalkSummaryEditorValue,
  shouldOpenTalkStudyPreview,
  TALK_CREATE_YOUTUBE_DRAFT_HINT,
} from './talk-generate-status';

const youtube = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
const audio = 'https://example.com/talk.mp3';

function status(
  overrides: Partial<Parameters<typeof getTalkGenerationStatus>[0]> = {}
) {
  return getTalkGenerationStatus({
    fetch: null,
    hasTranscript: false,
    mediaUrl: youtube,
    study: null,
    ...overrides,
  });
}

describe('getTalkCreateGenerationHint', () => {
  it('explains background drafts for YouTube and stays quiet until a URL exists', () => {
    expect(getTalkCreateGenerationHint('')).toBeNull();
    expect(getTalkCreateGenerationHint('  ')).toBeNull();
    expect(getTalkCreateGenerationHint(youtube)).toBe(
      TALK_CREATE_YOUTUBE_DRAFT_HINT
    );
    expect(getTalkCreateGenerationHint(audio)).toBe(
      NO_TRANSCRIPT_SOURCE_MESSAGE
    );
  });
});

describe('getTalkSummaryEditorValue', () => {
  it('uses a real draft, never a pending or failure sentinel', () => {
    expect(getTalkSummaryEditorValue(null)).toBe('');
    expect(
      getTalkSummaryEditorValue({ draftSummary: TALK_DRAFT_PENDING })
    ).toBe('');
    expect(
      getTalkSummaryEditorValue({
        draftSummary: 'Summary service returned an error.',
      })
    ).toBe('');
    expect(
      getTalkSummaryEditorValue({
        draftSummary: TALK_DRAFT_PENDING,
        summary: 'Public summary.',
      })
    ).toBe('Public summary.');
    expect(getTalkSummaryEditorValue({ draftSummary: 'Draft summary.' })).toBe(
      'Draft summary.'
    );
  });
});

describe('shouldOpenTalkStudyPreview', () => {
  it('opens preview only when a body arrives and the editor is not dirty', () => {
    expect(
      shouldOpenTalkStudyPreview({
        hadBody: false,
        hasBody: true,
        isDirty: false,
      })
    ).toBe(true);
    expect(
      shouldOpenTalkStudyPreview({
        hadBody: false,
        hasBody: true,
        isDirty: true,
      })
    ).toBe(false);
    expect(
      shouldOpenTalkStudyPreview({
        hadBody: true,
        hasBody: true,
        isDirty: false,
      })
    ).toBe(false);
    expect(
      shouldOpenTalkStudyPreview({
        hadBody: false,
        hasBody: false,
        isDirty: false,
      })
    ).toBe(false);
  });
});

describe('getTalkGenerationStatus', () => {
  it('keeps study waiting while the summary is generating after a ready transcript', () => {
    expect(
      status({
        draftSummary: TALK_DRAFT_PENDING,
        fetch: { status: 'success' },
        hasTranscript: true,
      })
    ).toEqual({
      study: { kind: 'waiting' },
      summary: { kind: 'generating' },
      transcript: { kind: 'ready' },
    });
  });

  it('restores draft-ready and published states on reopen', () => {
    expect(
      status({
        draftSummary: 'Draft summary.',
        fetch: { status: 'success' },
        hasTranscript: true,
        study: { body: 'Draft study.', status: 'draft' },
      })
    ).toEqual({
      study: { kind: 'draft' },
      summary: { kind: 'draft' },
      transcript: { kind: 'ready' },
    });

    expect(
      status({
        fetch: { status: 'success' },
        hasTranscript: true,
        study: { body: 'Published study.', status: 'published' },
        summary: 'Saved summary.',
      })
    ).toEqual({
      study: { kind: 'published' },
      summary: { kind: 'saved' },
      transcript: { kind: 'ready' },
    });
  });

  it('surfaces failures without treating them as queued work', () => {
    expect(
      status({
        fetch: {
          message: 'No captions are available for this talk.',
          status: 'failed',
        },
      })
    ).toEqual({
      study: { kind: 'missing' },
      summary: { kind: 'missing' },
      transcript: {
        kind: 'failed',
        message: 'No captions are available for this talk.',
      },
    });

    expect(
      status({
        draftStudy: 'Study service returned an error.',
        draftSummary: 'Summary service returned an error.',
        fetch: { status: 'success' },
        hasTranscript: true,
      })
    ).toEqual({
      study: {
        kind: 'failed',
        message: 'Study service returned an error.',
      },
      summary: {
        kind: 'failed',
        message: 'Summary service returned an error.',
      },
      transcript: { kind: 'ready' },
    });
  });

  it('marks unsupported media unavailable and never waiting', () => {
    expect(
      status({
        mediaUrl: audio,
      })
    ).toEqual({
      study: { kind: 'unavailable' },
      summary: { kind: 'unavailable' },
      transcript: { kind: 'unavailable' },
    });
  });

  it('treats a pending manual fetch as unknown downstream intent', () => {
    expect(
      status({
        fetch: { status: 'pending' },
        hasTranscript: false,
      })
    ).toEqual({
      study: { kind: 'missing' },
      summary: { kind: 'missing' },
      transcript: { kind: 'fetching' },
    });
  });

  it('shows Ready for a saved non-YouTube transcript', () => {
    expect(
      status({
        hasTranscript: true,
        mediaUrl: audio,
      })
    ).toEqual({
      study: { kind: 'unavailable' },
      summary: { kind: 'unavailable' },
      transcript: { kind: 'ready' },
    });
  });

  it('keeps saved and published content when a later attempt failed', () => {
    expect(
      status({
        draftStudy: 'Study service returned an error.',
        draftSummary: 'Summary service returned an error.',
        fetch: { status: 'success' },
        hasTranscript: true,
        study: { body: 'Published study.', status: 'published' },
        summary: 'Saved summary.',
      })
    ).toEqual({
      study: { kind: 'published' },
      summary: { kind: 'saved' },
      transcript: { kind: 'ready' },
    });
  });

  it('leaves idle YouTube talks missing instead of inventing a queue', () => {
    expect(status()).toEqual({
      study: { kind: 'missing' },
      summary: { kind: 'missing' },
      transcript: { kind: 'missing' },
    });
  });

  it('does not treat pending as saved summary text', () => {
    expect(
      status({
        draftSummary: TALK_DRAFT_PENDING,
        hasTranscript: true,
        summary: '',
      }).summary
    ).toEqual({ kind: 'generating' });
  });
});
