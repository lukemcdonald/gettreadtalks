import { describe, expect, it } from '@/test';

import { getCollectionUrl, getCollectionsPath } from './utils';

describe('getCollectionUrl', () => {
  it('links to /collections/{slug}', () => {
    expect(getCollectionUrl('on-death-and-dying')).toBe(
      '/collections/on-death-and-dying'
    );
  });
});

describe('getCollectionsPath', () => {
  it('links to /collections', () => {
    expect(getCollectionsPath()).toBe('/collections');
  });
});
