import type { Doc, Id } from '../../_generated/dataModel';
import type { QueryCtx } from '../../_generated/server';
import type { SearchArgs, StatusSearchArgs } from '../search/helpers';
import type { PaginationOptions } from 'convex/server';

import { asyncMap } from 'convex-helpers';

import { filterClipsWithPublishedTalk } from '../../lib/filters';
import { loadUntilFull } from '../../lib/utils';
import { searchTitleQuery } from '../search/helpers';

function publishedClipsQuery(ctx: QueryCtx) {
  return ctx.db
    .query('clips')
    .withIndex('by_status_and_publishedAt', (q) => q.eq('status', 'published'))
    .order('desc');
}

export async function listPublishedClips(ctx: QueryCtx) {
  return await filterClipsWithPublishedTalk(ctx, {
    clips: await publishedClipsQuery(ctx).collect(),
  });
}

export async function listPublishedClipsPage(
  ctx: QueryCtx,
  args: { paginationOpts: PaginationOptions }
) {
  const result = await publishedClipsQuery(ctx).paginate(args.paginationOpts);

  return {
    ...result,
    page: await filterClipsWithPublishedTalk(ctx, { clips: result.page }),
  };
}

export async function searchClips(ctx: QueryCtx, args: StatusSearchArgs) {
  return await ctx.db
    .query('clips')
    .withSearchIndex(
      'search_title',
      searchTitleQuery(args.queryText, args.status)
    )
    .take(args.limit);
}

export async function searchPublishedClips(ctx: QueryCtx, args: SearchArgs) {
  return await loadUntilFull(
    ctx.db
      .query('clips')
      .withSearchIndex(
        'search_title',
        searchTitleQuery(args.queryText, 'published')
      ),
    async (clip) => {
      if (!clip.talkId) {
        return true;
      }

      const talk = await ctx.db.get('talks', clip.talkId);

      return talk?.status === 'published';
    },
    args.limit
  );
}

export async function enrichClipsWithSpeaker<
  T extends { speakerId?: Id<'speakers'> },
>(
  ctx: QueryCtx,
  args: { items: T[] }
): Promise<(T & { speaker: Doc<'speakers'> | null })[]> {
  return await asyncMap(args.items, async (item: T) => {
    const speaker = item.speakerId
      ? await ctx.db.get('speakers', item.speakerId)
      : null;

    return { ...item, speaker };
  });
}

export async function enrichClipsForAdmin(
  ctx: QueryCtx,
  args: { clips: Doc<'clips'>[] }
) {
  const clipsWithSpeakers = await enrichClipsWithSpeaker(ctx, {
    items: args.clips,
  });

  return await asyncMap(clipsWithSpeakers, async (clip) => {
    const talk = clip.talkId ? await ctx.db.get('talks', clip.talkId) : null;

    return {
      ...clip,
      talkTitle: talk?.title ?? null,
    };
  });
}
