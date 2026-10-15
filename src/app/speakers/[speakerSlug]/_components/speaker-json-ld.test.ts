import { describe, expect, it } from '@/test';

import { speakerJsonLd } from './speaker-json-ld';

describe('speakerJsonLd', () => {
  it('adds sameAs when the speaker has a website', () => {
    const result = speakerJsonLd({
      name: 'Martyn Lloyd-Jones',
      speakerSlug: 'lloyd-jones',
      websiteUrl: 'https://mljtrust.org',
    });

    expect(result.sameAs).toEqual(['https://mljtrust.org']);
  });

  it('omits sameAs when the speaker has no website', () => {
    const result = speakerJsonLd({
      name: 'Martyn Lloyd-Jones',
      speakerSlug: 'lloyd-jones',
    });

    expect('sameAs' in result).toBe(false);
  });
});
