import { describe, expect, it } from 'vitest';

import { getVideoId, hasTalkTranscriptSource } from './videoUrl';

describe('getVideoId', () => {
  it.each([
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://www.youtube.com/live/a1SQSEiYDDs',
    },
    {
      expected: { id: '123456789', service: 'vimeo' },
      url: 'https://vimeo.com/123456789',
    },
    {
      expected: null,
      url: 'https://www.loom.com/share/0123456789abcdef0123456789abcdef',
    },
    {
      expected: null,
      url: 'https://example.com/talk.mp3',
    },
  ] as const)('reads $url', ({ expected, url }) => {
    expect(getVideoId(url)).toEqual(expected);
  });
});

describe('hasTalkTranscriptSource', () => {
  it.each([
    { expected: true, url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
    { expected: true, url: 'https://vimeo.com/123456789' },
    { expected: true, url: ' http://example.com/talk.mp3 ' },
    { expected: false, url: 'ftp://example.com/talk.mp3' },
    { expected: false, url: 'not a url' },
    { expected: false, url: '' },
  ])('reads $url as $expected', ({ expected, url }) => {
    expect(hasTalkTranscriptSource(url)).toBe(expected);
  });
});
