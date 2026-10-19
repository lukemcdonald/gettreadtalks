import { describe, expect, it } from '@/test';

import { parseYouTubeId, toYouTubeWatchUrl } from './youtube';

describe('parseYouTubeId', () => {
  it('reads watch, short, and embed urls', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=jNQXAC9IVRw')).toBe(
      'jNQXAC9IVRw'
    );
    expect(parseYouTubeId('https://youtu.be/jNQXAC9IVRw')).toBe('jNQXAC9IVRw');
    expect(parseYouTubeId('https://www.youtube.com/embed/jNQXAC9IVRw')).toBe(
      'jNQXAC9IVRw'
    );
    expect(
      parseYouTubeId(
        'https://www.youtube.com/watch?feature=share&v=jNQXAC9IVRw'
      )
    ).toBe('jNQXAC9IVRw');
  });

  it('returns null for non-youtube urls', () => {
    expect(parseYouTubeId('https://vimeo.com/123456789')).toBe(null);
    expect(parseYouTubeId('https://example.com/talk.mp4')).toBe(null);
  });
});

describe('toYouTubeWatchUrl', () => {
  it('normalizes youtu.be and watch urls to the canonical watch form', () => {
    expect(toYouTubeWatchUrl('https://youtu.be/jNQXAC9IVRw')).toBe(
      'https://www.youtube.com/watch?v=jNQXAC9IVRw'
    );
    expect(
      toYouTubeWatchUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw&t=12')
    ).toBe('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  });

  it('leaves non-youtube urls unchanged', () => {
    expect(toYouTubeWatchUrl('https://vimeo.com/123456789')).toBe(
      'https://vimeo.com/123456789'
    );
  });
});
