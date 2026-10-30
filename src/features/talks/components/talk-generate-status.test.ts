import {
  getTalkGenerateIdleStatus,
  getTalkGeneratePendingLabel,
} from '@/features/talks/components/talk-generate-status';
import { describe, expect, it } from '@/test';

describe('talk generate status', () => {
  it('describes pending and idle states', () => {
    expect(getTalkGeneratePendingLabel(true, false, 'summary')).toBe(
      'Getting transcript and generating summary...'
    );
    expect(getTalkGeneratePendingLabel(true, true, 'study')).toBe(
      'Generating study...'
    );
    expect(getTalkGenerateIdleStatus(false, null)).toBe(
      'Generating needs a YouTube video.'
    );
    expect(getTalkGenerateIdleStatus(true, 'Fetch failed.')).toBe(
      'Fetch failed.'
    );
  });
});
