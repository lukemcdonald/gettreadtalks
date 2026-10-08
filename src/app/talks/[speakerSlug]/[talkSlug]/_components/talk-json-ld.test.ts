import assert from 'node:assert/strict';
import { test } from 'node:test';

import { talkJsonLd } from './talk-json-ld.ts';

const speaker = { firstName: 'Martyn', lastName: 'Lloyd-Jones' };

test('uses VideoObject for YouTube and AudioObject otherwise', () => {
  const video = talkJsonLd({
    speaker,
    speakerSlug: 'lloyd-jones',
    talk: {
      mediaUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      title: 'The Cross',
    },
    talkSlug: 'the-cross',
  });
  const audio = talkJsonLd({
    speaker,
    speakerSlug: 'lloyd-jones',
    talk: { mediaUrl: 'https://example.com/talk.mp3', title: 'The Cross' },
    talkSlug: 'the-cross',
  });

  assert.equal(video['@type'], 'VideoObject');
  assert.equal(audio['@type'], 'AudioObject');
});

test('omits creator without a speaker and uploadDate without publishedAt', () => {
  const result = talkJsonLd({
    speaker: null,
    speakerSlug: 'lloyd-jones',
    talk: { title: 'The Cross' },
    talkSlug: 'the-cross',
  });

  assert.equal('creator' in result, false);
  assert.equal('uploadDate' in result, false);
});

test('adds creator and ISO uploadDate when present', () => {
  const result = talkJsonLd({
    speaker,
    speakerSlug: 'lloyd-jones',
    talk: { publishedAt: Date.UTC(2020, 0, 15), title: 'The Cross' },
    talkSlug: 'the-cross',
  });

  assert.deepEqual(result.creator, {
    '@type': 'Person',
    name: 'Martyn Lloyd-Jones',
  });
  assert.equal(result.uploadDate, '2020-01-15T00:00:00.000Z');
  assert.equal(
    result.url,
    'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross'
  );
});
