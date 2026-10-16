import { describe, expect, it } from '@/test';

import { getSpeakerUrl } from './utils';

describe('getSpeakerUrl', () => {
  it('links to /speakers/{slug}', () => {
    expect(getSpeakerUrl('lloyd-jones')).toBe('/speakers/lloyd-jones');
  });
});
