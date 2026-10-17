import { describe, expect, it } from '@/test';

import { getHoverItems } from './manage-hover-details';

describe('getHoverItems', () => {
  it('keeps useful extras and drops empty values', () => {
    expect(
      getHoverItems([
        { label: 'Scripture', value: 'Romans 8' },
        { label: 'Topics', value: '' },
        { label: 'Talks', value: 0 },
        { label: 'Featured', value: true },
        { label: 'Draft', value: false },
        { label: 'Missing', value: null },
      ])
    ).toEqual([
      { label: 'Scripture', value: 'Romans 8' },
      { label: 'Talks', value: '0' },
      { label: 'Featured', value: 'Yes' },
    ]);
  });
});
