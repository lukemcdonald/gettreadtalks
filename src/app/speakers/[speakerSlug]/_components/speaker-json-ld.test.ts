import assert from 'node:assert/strict';
import { test } from 'node:test';

import { speakerJsonLd } from './speaker-json-ld.ts';

test('adds sameAs only when the speaker has a website', () => {
  const withSite = speakerJsonLd({
    name: 'Martyn Lloyd-Jones',
    speakerSlug: 'lloyd-jones',
    websiteUrl: 'https://mljtrust.org',
  });
  const withoutSite = speakerJsonLd({
    name: 'Martyn Lloyd-Jones',
    speakerSlug: 'lloyd-jones',
  });

  assert.deepEqual(withSite.sameAs, ['https://mljtrust.org']);
  assert.equal('sameAs' in withoutSite, false);
});
