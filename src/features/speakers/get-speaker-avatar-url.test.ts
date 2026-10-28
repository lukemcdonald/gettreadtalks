import { describe, expect, it } from '@/test';

import { getSpeakerAvatarUrl } from './get-speaker-avatar-url';

describe('getSpeakerAvatarUrl', () => {
  it('resolves a speaker slug to the local image file', () => {
    expect(getSpeakerAvatarUrl({ slug: 'rt-kendall' })).toBe(
      '/images/speakers/rt-kendall.jpg'
    );
  });
});
