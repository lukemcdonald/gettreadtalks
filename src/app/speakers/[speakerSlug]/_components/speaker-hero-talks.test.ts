import { describe, expect, test } from 'vitest';

import {
  featuredHeroCandidates,
  speakerTalkLayout,
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

describe('featuredHeroCandidates', () => {
  test('uses featured video talks when any exist', () => {
    expect(
      featuredHeroCandidates([featuredAudio, featuredVideo, otherVideo])
    ).toEqual([featuredVideo]);
  });

  test('falls back to nonfeatured videos when none are featured video', () => {
    expect(featuredHeroCandidates([featuredAudio, otherVideo])).toEqual([
      otherVideo,
    ]);
  });

  test('returns no candidates when there are no videos', () => {
    expect(featuredHeroCandidates([featuredAudio])).toEqual([]);
  });
});

describe('speakerTalkLayout', () => {
  test('omits the featured video from the list', () => {
    expect(speakerTalkLayout([featuredVideo], featuredVideo)).toEqual({
      featuredTalk: featuredVideo,
      remainingTalks: [],
    });
    expect(
      speakerTalkLayout([featuredVideo, otherVideo], featuredVideo)
    ).toEqual({
      featuredTalk: featuredVideo,
      remainingTalks: [otherVideo],
    });
  });

  test('does not put audio in the hero or drop it from the list', () => {
    const talks = [featuredAudio, otherVideo];

    expect(speakerTalkLayout(talks, featuredAudio)).toEqual({
      featuredTalk: undefined,
      remainingTalks: talks,
    });
  });
});
