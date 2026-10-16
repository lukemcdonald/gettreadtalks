import { describe, expect, it } from '@/test';

import { buildSpeakerUrl, buildSpeakersPath } from './utils';

describe('buildSpeakerUrl', () => {
  it('links to /speakers/{slug}', () => {
    expect(buildSpeakerUrl('lloyd-jones')).toBe('/speakers/lloyd-jones');
  });
});

describe('buildSpeakersPath', () => {
  it('links to /speakers', () => {
    expect(buildSpeakersPath()).toBe('/speakers');
  });
});
