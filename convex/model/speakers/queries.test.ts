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
