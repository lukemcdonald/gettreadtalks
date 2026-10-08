import assert from 'node:assert/strict';
import { test } from 'node:test';

import { clipJsonLd } from './clip-json-ld.ts';

const speaker = {
  firstName: 'Martyn',
  lastName: 'Lloyd-Jones',
  slug: 'lloyd-jones',
};

test('uses VideoObject for YouTube and AudioObject otherwise', () => {
  const video = clipJsonLd({
    clip: {
      mediaUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      slug: 'the-cross-clip',
      title: 'The Cross clip',
    },
    speaker,
    talk: null,
  });
  const audio = clipJsonLd({
    clip: {
      mediaUrl: 'https://example.com/clip.mp3',
      slug: 'the-cross-clip',
      title: 'The Cross clip',
    },
    speaker,
    talk: null,
  });

  assert.equal(video['@type'], 'VideoObject');
  assert.equal(audio['@type'], 'AudioObject');
});

test('links the parent talk only when both talk and speaker are present', () => {
  const withTalk = clipJsonLd({
    clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
    speaker,
    talk: { slug: 'the-cross', title: 'The Cross' },
  });
  const withoutTalk = clipJsonLd({
    clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
    speaker,
    talk: null,
  });
  const withoutSpeaker = clipJsonLd({
    clip: { slug: 'the-cross-clip', title: 'The Cross clip' },
    speaker: null,
    talk: { slug: 'the-cross', title: 'The Cross' },
  });

  assert.deepEqual(withTalk.isPartOf, {
    '@type': 'CreativeWork',
    name: 'The Cross',
    url: 'https://www.gettreadtalks.com/talks/lloyd-jones/the-cross',
  });
  assert.equal('isPartOf' in withoutTalk, false);
  assert.equal('isPartOf' in withoutSpeaker, false);
});
