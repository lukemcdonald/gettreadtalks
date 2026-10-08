import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  PREVIEW_CLIPS,
  PREVIEW_COLLECTIONS,
  PREVIEW_SPEAKERS,
  PREVIEW_TALKS,
  PREVIEW_TOPICS,
  RETIRED_PREVIEW_SLUGS,
  slugsToDelete,
} from './previewFixtures.ts';

test('retired preview slugs are not reused by the current seed', () => {
  assert.deepEqual(
    slugsToDelete(
      PREVIEW_CLIPS.map((clip) => clip.slug),
      RETIRED_PREVIEW_SLUGS.clips
    ),
    [...RETIRED_PREVIEW_SLUGS.clips]
  );
  assert.deepEqual(
    slugsToDelete(
      PREVIEW_COLLECTIONS.map((collection) => collection.slug),
      RETIRED_PREVIEW_SLUGS.collections
    ),
    [...RETIRED_PREVIEW_SLUGS.collections]
  );
  assert.deepEqual(
    slugsToDelete(
      PREVIEW_SPEAKERS.map((speaker) => speaker.slug),
      RETIRED_PREVIEW_SLUGS.speakers
    ),
    [...RETIRED_PREVIEW_SLUGS.speakers]
  );
  assert.deepEqual(
    slugsToDelete(
      PREVIEW_TALKS.map((talk) => talk.slug),
      RETIRED_PREVIEW_SLUGS.talks
    ),
    [...RETIRED_PREVIEW_SLUGS.talks]
  );
  assert.deepEqual(
    slugsToDelete(
      PREVIEW_TOPICS.map((topic) => topic.slug),
      RETIRED_PREVIEW_SLUGS.topics
    ),
    [...RETIRED_PREVIEW_SLUGS.topics]
  );
});
