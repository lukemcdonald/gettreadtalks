import { describe, expect, it } from '@/test';

import { getTopicUrl } from './utils';

describe('getTopicUrl', () => {
  it('links to /topics/{slug}', () => {
    expect(getTopicUrl('justification')).toBe('/topics/justification');
  });
});
