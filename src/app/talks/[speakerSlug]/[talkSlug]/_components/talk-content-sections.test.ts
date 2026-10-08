import assert from 'node:assert/strict';
import { test } from 'node:test';

import { talkHighlightLinks } from './talk-highlight-links.ts';

test('talk highlights link each clip to /clips/{slug}', () => {
  const clips = [
    { slug: 'you-will-suffer', title: 'You Will Suffer' },
    {
      slug: 'sample-clip-no-condemnation',
      title: 'Sample Clip: No Condemnation',
    },
  ];
  const speakerSlug = 'john-piper';

  const highlights = talkHighlightLinks(clips);

  assert.equal(highlights.length, clips.length);

  for (const clip of clips) {
    const highlight = highlights.find((item) => item.title === clip.title);

    assert.ok(highlight);
    assert.equal(highlight.href, `/clips/${clip.slug}`);
    assert.notEqual(highlight.href, `/talks/${speakerSlug}/${clip.slug}`);
  }
});
