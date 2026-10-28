import { describe, expect, it } from '@/test';

import { getSpeakerAvatarUrl } from './get-speaker-avatar-url';

describe('getSpeakerAvatarUrl', () => {
  it('resolves a slug with an accent and apostrophe to the matching file', () => {
    expect(
      getSpeakerAvatarUrl(
        { slug: "Jean-Luc Pépin-O'Connor" },
        {
          'jean-luc-pepin-oconnor':
            '/images/speakers/jean-luc-pepin-oconnor.jpg',
        }
      )
    ).toBe('/images/speakers/jean-luc-pepin-oconnor.jpg');
  });

  it('resolves a speaker slug to the file of the same name', () => {
    expect(getSpeakerAvatarUrl({ slug: 'rt-kendall' })).toBe(
      '/images/speakers/rt-kendall.jpg'
    );
  });

  it('falls back to Convex imageUrl when no file exists', () => {
    expect(
      getSpeakerAvatarUrl({
        imageUrl: 'https://gravatar.com/avatar/abc',
        slug: 'unknown-speaker',
      })
    ).toBe('https://gravatar.com/avatar/abc');

    expect(
      getSpeakerAvatarUrl({
        imageUrl:
          'https://www.gettreadtalks.com/images/speakers/unknown-speaker.jpg',
        slug: 'unknown-speaker',
      })
    ).toBe('/images/speakers/unknown-speaker.jpg');

    expect(getSpeakerAvatarUrl({ slug: 'unknown-speaker' })).toBeUndefined();
  });
});
