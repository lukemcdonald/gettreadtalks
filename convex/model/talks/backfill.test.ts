import { describe, expect, it, vi } from 'vitest';

import { internal } from '../../_generated/api';
import { createConvexTest } from '../../test.setup';
import { insertSpeaker } from '../speakers/test.factory';
import { TALK_FORMAT_BACKFILL_PAGE_SIZE } from './backfill';
import { insertTalk } from './test.factory';

describe('backfillMissingTalkFormats', () => {
  it('sets sermon on talks with no format and leaves a format that is already set', async () => {
    const t = createConvexTest();
    const ids = await t.run(async (ctx) => {
      const speakerId = await insertSpeaker(ctx, {
        firstName: 'John',
        lastName: 'Owen',
        slug: 'john-owen',
      });
      const missing = await insertTalk(ctx, {
        slug: 'missing-format',
        speakerId,
        title: 'Missing Format',
      });
      const draft = await insertTalk(ctx, {
        slug: 'draft-missing',
        speakerId,
        status: 'backlog',
        title: 'Draft Missing',
      });
      const debate = await insertTalk(ctx, {
        format: 'debate',
        slug: 'kept-debate',
        speakerId,
        title: 'Kept Debate',
      });
      const sermon = await insertTalk(ctx, {
        format: 'sermon',
        slug: 'kept-sermon',
        speakerId,
        title: 'Kept Sermon',
      });

      return { debate, draft, missing, sermon };
    });

    const first = await t.mutation(
      internal.talks.backfillMissingTalkFormats,
      {}
    );
    const stored = await t.run(async (ctx) => ({
      debate: await ctx.db.get('talks', ids.debate),
      draft: await ctx.db.get('talks', ids.draft),
      missing: await ctx.db.get('talks', ids.missing),
      sermon: await ctx.db.get('talks', ids.sermon),
    }));

    expect(first).toMatchObject({ isDone: true, updated: 2 });
    expect(stored.missing?.format).toBe('sermon');
    expect(stored.draft?.format).toBe('sermon');
    expect(stored.debate?.format).toBe('debate');
    expect(stored.sermon?.format).toBe('sermon');

    const second = await t.mutation(
      internal.talks.backfillMissingTalkFormats,
      {}
    );
    const rerun = await t.run(async (ctx) => ({
      debate: await ctx.db.get('talks', ids.debate),
      missing: await ctx.db.get('talks', ids.missing),
    }));

    expect(second).toMatchObject({ isDone: true, updated: 0 });
    expect(rerun.missing?.format).toBe('sermon');
    expect(rerun.debate?.format).toBe('debate');
  });

  it('fills talks on the next page', async () => {
    vi.useFakeTimers();
    const t = createConvexTest();

    try {
      const trailingId = await t.run(async (ctx) => {
        const speakerId = await insertSpeaker(ctx, {
          firstName: 'John',
          lastName: 'Owen',
          slug: 'john-owen',
        });

        for (
          let index = 0;
          index < TALK_FORMAT_BACKFILL_PAGE_SIZE;
          index += 1
        ) {
          // oxlint-disable-next-line no-await-in-loop -- creation order is the backfill page order
          await insertTalk(ctx, {
            slug: `missing-${index}`,
            speakerId,
            title: `Missing ${index}`,
          });
        }

        return await insertTalk(ctx, {
          slug: 'trailing-missing',
          speakerId,
          title: 'Trailing Missing',
        });
      });
      const first = await t.mutation(
        internal.talks.backfillMissingTalkFormats,
        {}
      );
      const beforeNextPage = await t.run(
        async (ctx) => await ctx.db.get('talks', trailingId)
      );

      expect(first.isDone).toBe(false);
      expect(first.updated).toBe(TALK_FORMAT_BACKFILL_PAGE_SIZE);
      expect(beforeNextPage?.format).toBeUndefined();

      await t.finishAllScheduledFunctions(vi.runAllTimers);

      const trailing = await t.run(
        async (ctx) => await ctx.db.get('talks', trailingId)
      );

      expect(trailing?.format).toBe('sermon');
    } finally {
      vi.useRealTimers();
    }
  });
});
