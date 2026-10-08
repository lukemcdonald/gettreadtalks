import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  featuredHeroCandidates,
  speakerTalkLayout,
} from './speaker-hero-talks.ts';

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

test('rotates featured video talks when any exist', () => {
  assert.deepEqual(
    featuredHeroCandidates([featuredAudio, featuredVideo, otherVideo]),
    [featuredVideo]
  );
});

test('falls back to nonfeatured videos when none are featured video', () => {
  assert.deepEqual(featuredHeroCandidates([featuredAudio, otherVideo]), [
    otherVideo,
  ]);
});

test('returns no candidates when there are no videos', () => {
  assert.deepEqual(featuredHeroCandidates([featuredAudio]), []);
});

test('omits the featured video from the list even when it is the only talk', () => {
  assert.deepEqual(speakerTalkLayout([featuredVideo], featuredVideo), {
    featuredTalk: featuredVideo,
    remainingTalks: [],
  });
  assert.deepEqual(
    speakerTalkLayout([featuredVideo, otherVideo], featuredVideo),
    {
      featuredTalk: featuredVideo,
      remainingTalks: [otherVideo],
    }
  );
});

test('does not put audio in the hero or drop it from the list', () => {
  const talks = [featuredAudio, otherVideo];

  assert.deepEqual(speakerTalkLayout(talks, featuredAudio), {
    featuredTalk: undefined,
    remainingTalks: talks,
  });
});
