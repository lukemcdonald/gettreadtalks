import { describe, expect, it } from '@/test';

import { mediaJsonLd, preferItemsWithVideoThumbnails } from './utils';

describe('mediaJsonLd', () => {
  it('maps watch pages to player embedUrl and files to contentUrl', () => {
    expect(mediaJsonLd('https://www.youtube.com/watch?v=jNQXAC9IVRw')).toEqual({
      '@type': 'VideoObject',
      embedUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    });
    expect(mediaJsonLd('https://vimeo.com/123456789')).toEqual({
      '@type': 'VideoObject',
      embedUrl: 'https://player.vimeo.com/video/123456789',
    });
    expect(mediaJsonLd('https://example.com/talk.mp4')).toEqual({
      '@type': 'VideoObject',
      contentUrl: 'https://example.com/talk.mp4',
    });
    expect(mediaJsonLd('https://example.com/talk.mp3')).toEqual({
      '@type': 'AudioObject',
      contentUrl: 'https://example.com/talk.mp3',
    });
  });

  it('uses MediaObject when the URL is missing or not playable media', () => {
    expect(mediaJsonLd()).toEqual({ '@type': 'MediaObject' });
    expect(mediaJsonLd('https://example.com/notes')).toEqual({
      '@type': 'MediaObject',
    });
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
