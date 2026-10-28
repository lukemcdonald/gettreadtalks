import { describe, expect, it } from '@/test';

import { buildMediaJsonLd, preferItemsWithVideoThumbnails } from './utils';

describe('buildMediaJsonLd', () => {
  it('gives VideoObject a thumbnail and a playback url', () => {
    const results = [
      buildMediaJsonLd('https://www.youtube.com/watch?v=jNQXAC9IVRw'),
      buildMediaJsonLd('https://vimeo.com/123456789'),
      buildMediaJsonLd('https://example.com/talk.mp4', {
        thumbnailUrl: 'https://www.gettreadtalks.com/talks/og.png',
      }),
    ];

    for (const result of results) {
      expect(result?.['@type']).toBe('VideoObject');
      expect(result && 'thumbnailUrl' in result).toBe(true);
      expect(result && ('embedUrl' in result || 'contentUrl' in result)).toBe(
        true
      );
    }
  });

  it('uses AudioObject for audio and omits a media object otherwise', () => {
    expect(buildMediaJsonLd('https://example.com/talk.mp3')?.['@type']).toBe(
      'AudioObject'
    );
    expect(buildMediaJsonLd()).toBeUndefined();
    expect(buildMediaJsonLd('https://example.com/notes')).toBeUndefined();
  });
});

describe('preferItemsWithVideoThumbnails', () => {
  it('prefers items that have a video thumbnail', () => {
    const items = [
      { mediaUrl: 'https://example.com/talk.mp3', title: 'audio' },
      {
        mediaUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        title: 'video',
      },
    ];

    expect(preferItemsWithVideoThumbnails(items)).toEqual([items[1]]);
  });

  it('falls back to the full list when nothing has a thumbnail', () => {
    const items = [
      { mediaUrl: 'https://example.com/talk.mp3', title: 'audio-a' },
      { mediaUrl: 'https://example.com/talk-2.mp3', title: 'audio-b' },
    ];

    expect(preferItemsWithVideoThumbnails(items)).toEqual(items);
  });
});
