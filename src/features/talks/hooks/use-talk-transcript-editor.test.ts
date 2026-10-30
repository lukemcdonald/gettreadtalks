import {
  talkTranscriptCanSave,
  talkTranscriptDisplayText,
} from '@/features/talks/hooks/use-talk-transcript-editor';
import { describe, expect, it } from '@/test';

describe('talkTranscriptDisplayText', () => {
  it('prefers draft over loaded text', () => {
    expect(talkTranscriptDisplayText('draft', 'loaded')).toBe('draft');
    expect(talkTranscriptDisplayText(undefined, 'loaded')).toBe('loaded');
    expect(talkTranscriptDisplayText()).toBe('');
  });
});

describe('talkTranscriptCanSave', () => {
  it('requires ready state and non-empty trimmed text', () => {
    expect(talkTranscriptCanSave(false, 'text')).toBe(false);
    expect(talkTranscriptCanSave(true, '   ')).toBe(false);
    expect(talkTranscriptCanSave(true, 'text')).toBe(true);
  });
});
