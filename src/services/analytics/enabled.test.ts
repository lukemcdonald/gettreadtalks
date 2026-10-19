import { describe, expect, it } from '@/test';

import { isSegmentEnabled } from './enabled';

describe('isSegmentEnabled', () => {
  it('enables in production when a write key is set and the flag is not false', () => {
    expect(isSegmentEnabled('write-key', undefined, 'production')).toBe(true);
    expect(isSegmentEnabled('write-key', 'true', 'production')).toBe(true);
  });

  it('stays off without a write key', () => {
    expect(isSegmentEnabled(undefined, 'true', 'production')).toBe(false);
    expect(isSegmentEnabled('', 'true', 'production')).toBe(false);
  });

  it('stays off when the enabled flag is false', () => {
    expect(isSegmentEnabled('write-key', 'false', 'production')).toBe(false);
  });

  it('stays off outside Vercel production', () => {
    expect(isSegmentEnabled('write-key', 'true')).toBe(false);
    expect(isSegmentEnabled('write-key', 'true', 'development')).toBe(false);
    expect(isSegmentEnabled('write-key', 'true', 'preview')).toBe(false);
  });
});
