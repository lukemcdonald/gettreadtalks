import { describe, expect, it } from 'vitest';

import { getVideoId } from './videoUrl';

describe('getVideoId', () => {
  it.each([
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://www.youtube.com/watch?v=a1SQSEiYDDs',
    },
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://www.youtube.com/watch?v=a1SQSEiYDDs&t=30s&list=PLxx',
    },
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://youtu.be/a1SQSEiYDDs',
    },
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://m.youtube.com/watch?v=a1SQSEiYDDs',
    },
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://www.youtube-nocookie.com/embed/a1SQSEiYDDs',
    },
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://www.youtube.com/embed/a1SQSEiYDDs',
    },
    {
      expected: { id: 'a1SQSEiYDDs', service: 'youtube' },
      url: 'https://www.youtube.com/shorts/a1SQSEiYDDs',
    },
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
      url: '',
    },
    {
      expected: null,
      url: 'https://example.com/talk.mp3',
    },
  ] as const)('reads $url', ({ expected, url }) => {
    expect(getVideoId(url)).toEqual(expected);
  });
});
