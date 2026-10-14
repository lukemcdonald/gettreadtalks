import { describe, expect, test } from 'vitest';

import { getClipUrl } from './utils';

describe('getClipUrl', () => {
  test('links to /clips/{slug}', () => {
    expect(getClipUrl('you-will-suffer')).toBe('/clips/you-will-suffer');
  });
});
