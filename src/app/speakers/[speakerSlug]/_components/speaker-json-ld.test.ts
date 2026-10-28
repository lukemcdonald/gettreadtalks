import { describe, expect, it } from '@/test';

import { buildSpeakerJsonLd } from './speaker-json-ld';

describe('buildSpeakerJsonLd', () => {
  it('adds sameAs when the speaker has a website', () => {
    const result = buildSpeakerJsonLd({
      name: 'Martyn Lloyd-Jones',
      speakerSlug: 'lloyd-jones',
      websiteUrl: 'https://mljtrust.org',
    });

    expect(result.sameAs).toEqual(['https://mljtrust.org']);
  });

  it('omits sameAs when the speaker has no website', () => {
    const result = buildSpeakerJsonLd({
      name: 'Martyn Lloyd-Jones',
      speakerSlug: 'lloyd-jones',
    });

    expect('sameAs' in result).toBe(false);
  });

  it('adds jobTitle when the speaker has a role', () => {
    const result = buildSpeakerJsonLd({
      name: 'Martyn Lloyd-Jones',
      role: 'Pastor',
      speakerSlug: 'lloyd-jones',
    });

    expect(result.jobTitle).toBe('Pastor');
    expect(result.url).toBe(
      'https://www.gettreadtalks.com/speakers/lloyd-jones'
    );
  });
});
