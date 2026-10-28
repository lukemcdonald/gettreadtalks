import { readdirSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from '@/test';

import { getSpeakerAvatarUrl } from './get-speaker-avatar-url';

describe('getSpeakerAvatarUrl', () => {
  it('resolves a slug with an accent and apostrophe', () => {
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

  it('resolves from first and last name when slug is missing', () => {
    expect(getSpeakerAvatarUrl({ firstName: 'RT', lastName: 'Kendall' })).toBe(
      '/images/speakers/rt-kendall.jpg'
    );
  });

  it('rewrites a same-origin speaker image URL to a local path', () => {
    expect(
      getSpeakerAvatarUrl({
        imageUrl:
          'https://www.gettreadtalks.com/images/speakers/unknown-speaker.jpg',
        slug: 'unknown-speaker',
      })
    ).toBe('/images/speakers/unknown-speaker.jpg');
  });

  it('keeps a remote image URL when no local file exists', () => {
    expect(
      getSpeakerAvatarUrl({
        imageUrl: 'https://gravatar.com/avatar/abc',
        slug: 'unknown-speaker',
      })
    ).toBe('https://gravatar.com/avatar/abc');
  });

  it('returns undefined when there is no file and no image URL', () => {
    expect(getSpeakerAvatarUrl({ slug: 'unknown-speaker' })).toBeUndefined();
  });

  it('resolves every non-banner file in public/images/speakers', () => {
    const files = readdirSync(
      path.join(process.cwd(), 'public/images/speakers')
    ).filter((filename) => !filename.includes('-banner'));

    expect(files.length).toBeGreaterThan(0);

    for (const filename of files) {
      const slug = filename.replace(/\.[^.]+$/u, '');

      expect(getSpeakerAvatarUrl({ slug })).toBe(
        `/images/speakers/${filename}`
      );
    }
  });
});
