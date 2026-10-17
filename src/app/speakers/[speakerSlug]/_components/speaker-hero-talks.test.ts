import { describe, expect, it } from '@/test';

import {
  getFeaturedHeroCandidates,
  getSpeakerTalkLayout,
} from './speaker-hero-talks';

const youtube = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
const audio = 'https://example.com/talk.mp3';

const featuredVideo = {
  _id: 'featured-video',
  featured: true,
  mediaUrl: youtube,
};
const featuredAudio = {
  _id: 'featured-audio',
  featured: true,
  mediaUrl: audio,
};
const otherVideo = { _id: 'other-video', featured: false, mediaUrl: youtube };

describe('getFeaturedHeroCandidates', () => {
  it('uses featured video talks when any exist', () => {
    expect(
      getFeaturedHeroCandidates([featuredAudio, featuredVideo, otherVideo])
    ).toEqual([featuredVideo]);
  });

  it('falls back to nonfeatured videos when none are featured video', () => {
    expect(getFeaturedHeroCandidates([featuredAudio, otherVideo])).toEqual([
      otherVideo,
    ]);
  });

  it('returns no candidates when there are no videos', () => {
    expect(getFeaturedHeroCandidates([featuredAudio])).toEqual([]);
  });
});

describe('getSpeakerTalkLayout', () => {
  it('omits the featured video from the list', () => {
    expect(getSpeakerTalkLayout([featuredVideo], featuredVideo)).toEqual({
      featuredTalk: featuredVideo,
      remainingTalks: [],
    });
    expect(
      getSpeakerTalkLayout([featuredVideo, otherVideo], featuredVideo)
    ).toEqual({
      featuredTalk: featuredVideo,
      remainingTalks: [otherVideo],
    });
  });

  it('does not put audio in the hero or drop it from the list', () => {
    const talks = [featuredAudio, otherVideo];

    expect(getSpeakerTalkLayout(talks, featuredAudio)).toEqual({
      featuredTalk: undefined,
      remainingTalks: talks,
    });
  });
});
