import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { speakerJsonLd } from './speaker-json-ld.ts';

describe('speakerJsonLd', () => {
  test('adds sameAs when the speaker has a website', () => {
    const result = speakerJsonLd({
      name: 'Martyn Lloyd-Jones',
      speakerSlug: 'lloyd-jones',
      websiteUrl: 'https://mljtrust.org',
    });

    assert.deepEqual(result.sameAs, ['https://mljtrust.org']);
  });

  test('omits sameAs when the speaker has no website', () => {
    const result = speakerJsonLd({
      name: 'Martyn Lloyd-Jones',
      speakerSlug: 'lloyd-jones',
    });

    assert.equal('sameAs' in result, false);
  });
});
