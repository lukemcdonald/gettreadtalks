import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import {
  createConvexTest,
  seedVisibilityCatalog,
  visibilitySlugs,
} from '../../test.setup';

describe('listPublishedSpeakers', () => {
  it('lists only speakers with published talks or clips', async () => {
    const t = createConvexTest();
    await seedVisibilityCatalog(t);

    const speakers = await t.query(api.speakers.listPublishedSpeakers, {});

    expect(speakers.map((speaker) => speaker.slug)).toEqual([
      visibilitySlugs.publishedSpeaker,
    ]);
    expect(speakers.map((speaker) => speaker.slug)).not.toContain(
      visibilitySlugs.draftSpeaker
    );
  });
});
