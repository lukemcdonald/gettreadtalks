import { describe, expect, it } from '@/test';

import { getTopicUrl, getTopicsPath } from './utils';

describe('getTopicUrl', () => {
  it('links to /topics/{slug}', () => {
    expect(getTopicUrl('justification')).toBe('/topics/justification');
  });
});

describe('getTopicsPath', () => {
  it('links to /topics', () => {
    expect(getTopicsPath()).toBe('/topics');
  });
});
