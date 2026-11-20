import { describe, expect, it } from '@/test';

import {
  formatUnsavedStatusNotice,
  getUnsavedStatusPrefill,
  parseStatusPrefill,
} from './status-prefill';

describe('parseStatusPrefill', () => {
  it('accepts archived', () => {
    expect(parseStatusPrefill('archived')).toBe('archived');
  });

  it('ignores missing or other values', () => {
    expect(parseStatusPrefill()).toBe(undefined);
    expect(parseStatusPrefill('')).toBe(undefined);
    expect(parseStatusPrefill('published')).toBe(undefined);
  });

  it('uses the first query value', () => {
    expect(parseStatusPrefill(['archived', 'published'])).toBe('archived');
  });
});

describe('getUnsavedStatusPrefill', () => {
  it('returns archived when the saved status is different', () => {
    expect(getUnsavedStatusPrefill('published', 'archived')).toBe('archived');
    expect(getUnsavedStatusPrefill(undefined, 'archived')).toBe('archived');
  });

  it('returns nothing when the saved status already matches', () => {
    expect(getUnsavedStatusPrefill('archived', 'archived')).toBeUndefined();
    expect(getUnsavedStatusPrefill('published')).toBeUndefined();
  });
});

describe('formatUnsavedStatusNotice', () => {
  it('says the pre-filled status is not saved yet', () => {
    expect(formatUnsavedStatusNotice('archived')).toBe(
      'Status was pre-filled as Archived and is not saved until you press Save.'
    );
  });
});
