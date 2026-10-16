import { describe, expect, it } from '@/test';

import { buildTopicUrl, buildTopicsPath } from './utils';

describe('buildTopicUrl', () => {
  it('links to /topics/{slug}', () => {
    expect(buildTopicUrl('justification')).toBe('/topics/justification');
  });
});

describe('buildTopicsPath', () => {
  it('links to /topics', () => {
    expect(buildTopicsPath()).toBe('/topics');
  });
});
