import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listSpeakerSlugs', () => {
  it('lists only speakers with published talks or clips', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speakers = await t.query(api.speakers.listSpeakerSlugs, {});
    const slugs = speakers.map((speaker) => speaker.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedSpeaker]);
    expect(slugs).not.toContain(visibilitySlugs.draftSpeaker);
  });
});

describe('getSpeakerBySlug', () => {
  it('lists unique topics from published talks and omits unpublished-only topics', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speaker = await t.query(api.speakers.getSpeakerBySlug, {
      slug: visibilitySlugs.publishedSpeaker,
    });

    expect(speaker?.topics.map((topic) => topic.slug)).toEqual([
      visibilitySlugs.publishedTopic,
    ]);
    expect(speaker?.topics.map((topic) => topic.slug)).not.toContain(
      visibilitySlugs.unpublishedOnlyTopic
    );
  });

  it('hides topics when the speaker has no published talk topics', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speaker = await t.query(api.speakers.getSpeakerBySlug, {
      slug: visibilitySlugs.draftSpeaker,
    });

    expect(speaker?.topics).toEqual([]);
  });
});
