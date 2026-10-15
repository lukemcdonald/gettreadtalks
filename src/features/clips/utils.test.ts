import { describe, expect, it } from '@/test';

import { getClipUrl } from './utils';

describe('getClipUrl', () => {
  it('links to /clips/{slug}', () => {
    expect(getClipUrl('you-will-suffer')).toBe('/clips/you-will-suffer');
  });
});
