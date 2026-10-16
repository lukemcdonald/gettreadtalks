import { describe, expect, it } from '@/test';

import { getClipUrl, getClipsPath } from './utils';

describe('getClipUrl', () => {
  it('links to /clips/{slug}', () => {
    expect(getClipUrl('you-will-suffer')).toBe('/clips/you-will-suffer');
  });
});

describe('getClipsPath', () => {
  it('links to /clips', () => {
    expect(getClipsPath()).toBe('/clips');
  });
});
