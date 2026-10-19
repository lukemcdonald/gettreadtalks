import type { Id } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';

import { deleteAll } from '../../lib/utils';

/**
 * Get user's favorite clips with clip data.
 */
export async function getUserFavoriteClips(
  ctx: QueryCtx,
  userId: string,
  limit: number
) {
  const rows = await ctx.db
    .query('userFavoriteClips')
    .withIndex('by_userId_and_clipId', (q) => q.eq('userId', userId))
    .take(limit);

  const enriched = await Promise.all(
    rows.map(async (row) => {
      const clip = await ctx.db.get(row.clipId);
      if (!clip) {
        return null;
      }
      return {
        _id: clip._id,
        favoriteId: row._id,
        slug: clip.slug,
        title: clip.title,
      };
    })
  );

  return enriched.filter((x): x is NonNullable<typeof x> => x !== null);
}

/**
 * Get user's favorite speakers with speaker data.
 */
export async function getUserFavoriteSpeakers(
  ctx: QueryCtx,
  userId: string,
  limit: number
) {
  const rows = await ctx.db
    .query('userFavoriteSpeakers')
    .withIndex('by_userId_and_speakerId', (q) => q.eq('userId', userId))
    .take(limit);

  const enriched = await Promise.all(
    rows.map(async (row) => {
      const speaker = await ctx.db.get(row.speakerId);
      if (!speaker) {
        return null;
      }
      return {
        _id: speaker._id,
        favoriteId: row._id,
        firstName: speaker.firstName,
        imageUrl: speaker.imageUrl,
        lastName: speaker.lastName,
        slug: speaker.slug,
      };
    })
  );

  return enriched.filter((x): x is NonNullable<typeof x> => x !== null);
}

/**
 * Get user's favorite talks with talk and speaker data.
 */
export async function getUserFavoriteTalks(
  ctx: QueryCtx,
  userId: string,
  limit: number
) {
  const rows = await ctx.db
    .query('userFavoriteTalks')
    .withIndex('by_userId_and_talkId', (q) => q.eq('userId', userId))
    .take(limit);

  return await listUserTalks(ctx, rows, 'favoriteId');
}

/**
 * Get user's finished talks with talk and speaker data.
 */
export async function getUserFinishedTalks(
  ctx: QueryCtx,
  userId: string,
  limit: number
) {
  const rows = await ctx.db
    .query('userFinishedTalks')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .order('desc')
    .take(limit);

  return await listUserTalks(ctx, rows, 'finishedId');
}

/**
 * Remove app-owned rows keyed by Better Auth user id. Auth tables are
 * deleted by Better Auth itself.
 */
export async function destroyUserOwnedRows(ctx: MutationCtx, userId: string) {
  const [clips, speakers, talks, finished] = await Promise.all([
    ctx.db
      .query('userFavoriteClips')
      .withIndex('by_userId_and_clipId', (q) => q.eq('userId', userId))
      .collect(),
    ctx.db
      .query('userFavoriteSpeakers')
      .withIndex('by_userId_and_speakerId', (q) => q.eq('userId', userId))
      .collect(),
    ctx.db
      .query('userFavoriteTalks')
      .withIndex('by_userId_and_talkId', (q) => q.eq('userId', userId))
      .collect(),
    ctx.db
      .query('userFinishedTalks')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect(),
  ]);

  await deleteAll(ctx, [...clips, ...speakers, ...talks, ...finished]);
}

async function listUserTalks<Key extends 'favoriteId' | 'finishedId'>(
  ctx: QueryCtx,
  rows: { _id: string; talkId: Id<'talks'> }[],
  idKey: Key
) {
  const enriched = await Promise.all(
    rows.map(async (row) => {
      const talk = await loadTalkListItem(ctx, row.talkId);

      if (!talk) {
        return null;
      }

      return {
        ...talk,
        [idKey]: row._id,
      };
    })
  );

  return enriched.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );
}

async function loadTalkListItem(ctx: QueryCtx, talkId: Id<'talks'>) {
  const talk = await ctx.db.get(talkId);

  if (!talk) {
    return null;
  }

  const speaker = await ctx.db.get(talk.speakerId);

  return {
    _id: talk._id,
    slug: talk.slug,
    speaker: toSpeakerSummary(speaker),
    title: talk.title,
  };
}

function toSpeakerSummary(
  speaker: {
    firstName: string;
    lastName: string;
    slug: string;
  } | null
) {
  if (!speaker) {
    return null;
  }

  return {
    firstName: speaker.firstName,
    lastName: speaker.lastName,
    slug: speaker.slug,
  };
}
