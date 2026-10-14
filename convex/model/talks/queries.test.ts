import { describe, expect, test } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('getTalkBySlug', () => {
  test('returns a published talk and hides an unpublished one', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const published = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.publishedTalk,
    });
    const unpublished = await t.query(api.talks.getTalkBySlug, {
      speakerSlug: visibilitySlugs.publishedSpeaker,
      talkSlug: visibilitySlugs.draftTalk,
    });

    expect(published?.talk.slug).toBe(visibilitySlugs.publishedTalk);
    expect(unpublished).toBeNull();
  });
});
