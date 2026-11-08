import { describe, expect, it } from '@/test';

import { parseStudyStatus } from './manage-status';

describe('parseStudyStatus', () => {
  it('defaults missing and unknown values to draft', () => {
    expect(parseStudyStatus()).toBe('draft');
    expect(parseStudyStatus('none')).toBe('draft');
    expect(parseStudyStatus('draft')).toBe('draft');
  });

  it('keeps published', () => {
    expect(parseStudyStatus('published')).toBe('published');
  });
});
