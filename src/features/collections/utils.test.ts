import { describe, expect, it } from '@/test';

import { buildCollectionUrl, buildCollectionsPath } from './utils';

describe('buildCollectionUrl', () => {
  it('links to /collections/{slug}', () => {
    expect(buildCollectionUrl('on-death-and-dying')).toBe(
      '/collections/on-death-and-dying'
    );
  });
});

describe('buildCollectionsPath', () => {
  it('links to /collections', () => {
    expect(buildCollectionsPath()).toBe('/collections');
  });
});
