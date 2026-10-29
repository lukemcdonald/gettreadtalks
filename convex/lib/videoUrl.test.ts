import { describe, expect, it } from 'vitest';

import { getVideoId } from './videoUrl';

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
