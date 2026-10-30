import { describe, expect, it } from 'vitest';

import { api, internal } from '../../../_generated/api';
import { createConvexTest, signInAs } from '../../../test.setup';
import { insertClip } from '../../clips/test.factory';
import { insertSpeaker } from '../../speakers/test.factory';
import { insertTalk } from '../../talks/test.factory';

const CHECKED_AT = 1_700_000_000_000;
const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

describe('clearMediaChecksForEntity', () => {
  it('drops archived talks and clips from the next digest scan', async () => {
    const t = createConvexTest();
    const { asUser } = await signInAs(t, {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
    });
    const ids = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx, {
        firstName: 'John',
        lastName: 'Doe',
        slug: 'john-doe',
      });
      const talkId = await insertTalk(ctx, {
        slug: 'first-talk',
        speakerId,
        title: 'First Talk',
      });
      const clipId = await insertClip(ctx, {
        slug: 'first-clip',
        title: 'First Clip',
      });

      return { clipId, talkId };
    });

    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT,
      entityId: ids.talkId,
      entityTable: 'talks',
      mediaUrl: MEDIA_URL,
      observedStatus: 'private',
    });
    await t.mutation(internal.mediaHealth.upsertMediaCheck, {
      checkedAt: CHECKED_AT,
      entityId: ids.clipId,
      entityTable: 'clips',
      mediaUrl: MEDIA_URL,
      observedStatus: 'missing',
    });

    await asUser.mutation(api.talks.archiveTalk, { talkId: ids.talkId });
    await asUser.mutation(api.clips.archiveClip, { clipId: ids.clipId });

    const talks = await t.query(internal.mediaHealth.listPublishedMediaPage, {
      paginationOpts: { cursor: null, numItems: 10 },
      source: 'talks',
    });
    const clips = await t.query(internal.mediaHealth.listPublishedMediaPage, {
      paginationOpts: { cursor: null, numItems: 10 },
      source: 'clips',
    });
    const remaining = await t.run(
      async (ctx) => await ctx.db.query('mediaChecks').collect()
    );

    expect(talks.page.map((item) => item.entityId)).not.toContain(ids.talkId);
    expect(clips.page.map((item) => item.entityId)).not.toContain(ids.clipId);
    expect(remaining).toEqual([]);
  });
});
