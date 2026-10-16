import { describe, expect, it } from '@/test';

import { buildClipUrl, buildClipsPath } from './utils';

describe('buildClipUrl', () => {
  it('links to /clips/{slug}', () => {
    expect(buildClipUrl('you-will-suffer')).toBe('/clips/you-will-suffer');
  });
});

describe('buildClipsPath', () => {
  it('links to /clips', () => {
    expect(buildClipsPath()).toBe('/clips');
  });
});
