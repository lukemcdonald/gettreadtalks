import { describe, expect, it } from '@/test';

import { getSpeakerUrl, getSpeakersPath } from './utils';

describe('getSpeakerUrl', () => {
  it('links to /speakers/{slug}', () => {
    expect(getSpeakerUrl('lloyd-jones')).toBe('/speakers/lloyd-jones');
  });
});

describe('getSpeakersPath', () => {
  it('links to /speakers', () => {
    expect(getSpeakersPath()).toBe('/speakers');
  });
});
