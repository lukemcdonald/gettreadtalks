import { describe, expect, it } from '@/test';

import { isSegmentEnabled } from './enabled';

describe('isSegmentEnabled', () => {
  it('stays off when the enabled flag is unset', () => {
    expect(isSegmentEnabled('write-key')).toBe(false);
  });

  it('stays off when the enabled flag is false', () => {
    expect(isSegmentEnabled('write-key', 'false')).toBe(false);
  });

  it('stays off without a write key', () => {
    expect(isSegmentEnabled()).toBe(false);
    expect(isSegmentEnabled('', 'true')).toBe(false);
  });

  it('enables when a write key is set and the flag is true', () => {
    expect(isSegmentEnabled('write-key', 'true')).toBe(true);
  });
});
