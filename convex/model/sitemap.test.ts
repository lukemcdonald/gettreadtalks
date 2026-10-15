import { describe, expect, it } from 'vitest';

import { api } from '../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../test.setup';

describe('sitemap queries', () => {
  it('lists only published talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const talks = await t.query(api.talks.listTalkSlugsForSitemap, {});

    expect(talks.map((talk) => talk.talkSlug)).toEqual([
      visibilitySlugs.publishedTalk,
    ]);
  });

  it('lists only speakers with published talks or clips', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speakers = await t.query(api.speakers.listSpeakerSlugsForSitemap, {});

    expect(speakers.map((speaker) => speaker.slug)).toEqual([
      visibilitySlugs.publishedSpeaker,
    ]);
    expect(speakers.map((speaker) => speaker.slug)).not.toContain(
      visibilitySlugs.draftSpeaker
    );
  });

  it('omits empty collections and collections with only unpublished talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const collections = await t.query(
      api.collections.listCollectionSlugsForSitemap,
      {}
    );
    const slugs = collections.map((collection) => collection.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedCollection]);
    expect(slugs).not.toContain(visibilitySlugs.emptyCollection);
    expect(slugs).not.toContain(visibilitySlugs.unpublishedOnlyCollection);
  });

  it('omits topics with no published talks', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const topics = await t.query(api.topics.listTopicSlugsForSitemap, {});
    const slugs = topics.map((topic) => topic.slug);

    expect(slugs).toEqual([visibilitySlugs.publishedTopic]);
    expect(slugs).not.toContain(visibilitySlugs.emptyTopic);
    expect(slugs).not.toContain(visibilitySlugs.unpublishedOnlyTopic);
  });

  it('omits published clips whose parent talk is unpublished', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const clips = await t.query(api.clips.listClipSlugsForSitemap, {});
    const slugs = clips.map((clip) => clip.slug).toSorted();

    expect(slugs).toEqual([
      visibilitySlugs.clipOnPublishedTalk,
      visibilitySlugs.standaloneClip,
    ]);
    expect(slugs).not.toContain(visibilitySlugs.clipOnDraftTalk);
  });
});
