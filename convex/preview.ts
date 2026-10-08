import type { Id, TableNames } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

import { hashPassword } from 'better-auth/crypto';
import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { components, internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';
import { throwForbidden, throwValidationError } from './lib/errors';
import {
  PREVIEW_CLIPS,
  PREVIEW_COLLECTIONS,
  PREVIEW_SPEAKERS,
  PREVIEW_TALKS,
  PREVIEW_TOPICS,
} from './previewFixtures';

const seedContentResultValidator = v.object({
  clipCount: v.number(),
  collectionCount: v.number(),
  speakerCount: v.number(),
  talkCount: v.number(),
  topicCount: v.number(),
});

function assertPreviewHost() {
  const siteUrl = process.env.SITE_URL ?? '';
  let hostname = '';

  try {
    ({ hostname } = new URL(siteUrl));
  } catch {
    throwForbidden('Preview seed requires SITE_URL');
  }

  if (!hostname.endsWith('.vercel.app')) {
    throwForbidden('Preview seed only runs when SITE_URL is a Vercel preview');
  }
}

function adapterRecordId(record: unknown): string | undefined {
  if (!record || typeof record !== 'object') {
    return undefined;
  }

  if ('id' in record && typeof record.id === 'string') {
    return record.id;
  }

  if ('_id' in record && typeof record._id === 'string') {
    return record._id;
  }

  return undefined;
}

function requireSeedId<Table extends TableNames>(
  idsBySlug: Map<string, Id<Table>>,
  kind: string,
  slug: string
): Id<Table> {
  const id = idsBySlug.get(slug);

  if (!id) {
    throwValidationError(`Missing seed ${kind} ${slug}`);
  }

  return id;
}

async function upsertCredentialAccount(
  ctx: MutationCtx,
  passwordHash: string,
  userId: string
) {
  const now = Date.now();
  const existingAccount: unknown = await ctx.runQuery(
    components.betterAuth.adapter.findOne,
    {
      model: 'account',
      where: [
        {
          field: 'providerId',
          value: 'credential',
        },
        {
          connector: 'AND',
          field: 'userId',
          value: userId,
        },
      ],
    }
  );

  const existingAccountId = adapterRecordId(existingAccount);

  if (existingAccountId) {
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: 'account',
        update: {
          password: passwordHash,
          updatedAt: now,
        },
        where: [
          {
            field: '_id',
            value: existingAccountId,
          },
        ],
      },
    });

    return;
  }

  await ctx.runMutation(components.betterAuth.adapter.create, {
    input: {
      data: {
        accountId: userId,
        createdAt: now,
        password: passwordHash,
        providerId: 'credential',
        updatedAt: now,
        userId,
      },
      model: 'account',
    },
  });
}

async function upsertSpeaker(
  ctx: MutationCtx,
  speaker: (typeof PREVIEW_SPEAKERS)[number]
): Promise<Id<'speakers'>> {
  const existing = await getOneFrom(
    ctx.db,
    'speakers',
    'by_slug',
    speaker.slug
  );

  if (existing) {
    await ctx.db.patch(existing._id, {
      description: speaker.description,
      featured: speaker.featured,
      firstName: speaker.firstName,
      lastName: speaker.lastName,
      ministry: speaker.ministry,
      role: speaker.role,
      updatedAt: Date.now(),
      websiteUrl: speaker.websiteUrl,
    });

    return existing._id;
  }

  return await ctx.db.insert('speakers', speaker);
}

async function upsertTopic(
  ctx: MutationCtx,
  topic: (typeof PREVIEW_TOPICS)[number]
): Promise<Id<'topics'>> {
  const existing = await getOneFrom(ctx.db, 'topics', 'by_slug', topic.slug);

  if (existing) {
    await ctx.db.patch(existing._id, {
      title: topic.title,
      updatedAt: Date.now(),
    });

    return existing._id;
  }

  return await ctx.db.insert('topics', topic);
}

async function upsertCollection(
  ctx: MutationCtx,
  collection: (typeof PREVIEW_COLLECTIONS)[number]
): Promise<Id<'collections'>> {
  const existing = await getOneFrom(
    ctx.db,
    'collections',
    'by_slug',
    collection.slug
  );

  if (existing) {
    await ctx.db.patch(existing._id, {
      description: collection.description,
      title: collection.title,
      updatedAt: Date.now(),
    });

    return existing._id;
  }

  return await ctx.db.insert('collections', collection);
}

async function upsertTalk(
  ctx: MutationCtx,
  collectionId: Id<'collections'>,
  speakerId: Id<'speakers'>,
  talk: (typeof PREVIEW_TALKS)[number]
): Promise<Id<'talks'>> {
  const existing = await getOneFrom(ctx.db, 'talks', 'by_slug', talk.slug);
  const publishedAt =
    talk.status === 'published' ? talk.publishedAt : undefined;
  const fields = {
    collectionId,
    collectionOrder: talk.collectionOrder,
    description: talk.description,
    featured: talk.featured,
    mediaUrl: talk.mediaUrl,
    publishedAt,
    scripture: talk.scripture,
    speakerId,
    status: talk.status,
    title: talk.title,
  };

  if (existing) {
    await ctx.db.patch(existing._id, {
      ...fields,
      updatedAt: Date.now(),
    });

    return existing._id;
  }

  return await ctx.db.insert('talks', {
    ...fields,
    slug: talk.slug,
  });
}

async function upsertClip(
  ctx: MutationCtx,
  speakerId: Id<'speakers'>,
  talkId: Id<'talks'>,
  clip: (typeof PREVIEW_CLIPS)[number]
): Promise<Id<'clips'>> {
  const existing = await getOneFrom(ctx.db, 'clips', 'by_slug', clip.slug);
  const publishedAt =
    clip.status === 'published' ? clip.publishedAt : undefined;
  const fields = {
    description: clip.description,
    mediaUrl: clip.mediaUrl,
    publishedAt,
    speakerId,
    status: clip.status,
    talkId,
    title: clip.title,
  };

  if (existing) {
    await ctx.db.patch(existing._id, {
      ...fields,
      updatedAt: Date.now(),
    });

    return existing._id;
  }

  return await ctx.db.insert('clips', {
    ...fields,
    slug: clip.slug,
  });
}

async function upsertTalkTopics(
  ctx: MutationCtx,
  talkId: Id<'talks'>,
  topicIds: Id<'topics'>[]
) {
  const uniqueTopicIds = [...new Set(topicIds)];
  const existing = await ctx.db
    .query('talksOnTopics')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .collect();
  const existingIds = new Set(existing.map((row) => row.topicId));
  const nextIds = new Set(uniqueTopicIds);

  await Promise.all(
    existing
      .filter((row) => !nextIds.has(row.topicId))
      .map((row) => ctx.db.delete(row._id))
  );

  await Promise.all(
    uniqueTopicIds
      .filter((topicId) => !existingIds.has(topicId))
      .map((topicId) =>
        ctx.db.insert('talksOnTopics', {
          talkId,
          topicId,
        })
      )
  );
}

export const seedContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    assertPreviewHost();

    const collectionIdsBySlug = new Map<string, Id<'collections'>>();
    const speakerIdsBySlug = new Map<string, Id<'speakers'>>();
    const talkIdsBySlug = new Map<string, Id<'talks'>>();
    const topicIdsBySlug = new Map<string, Id<'topics'>>();

    await Promise.all([
      Promise.all(
        PREVIEW_SPEAKERS.map(async (speaker) => {
          const speakerId = await upsertSpeaker(ctx, speaker);
          speakerIdsBySlug.set(speaker.slug, speakerId);
        })
      ),
      Promise.all(
        PREVIEW_TOPICS.map(async (topic) => {
          const topicId = await upsertTopic(ctx, topic);
          topicIdsBySlug.set(topic.slug, topicId);
        })
      ),
      Promise.all(
        PREVIEW_COLLECTIONS.map(async (collection) => {
          const collectionId = await upsertCollection(ctx, collection);
          collectionIdsBySlug.set(collection.slug, collectionId);
        })
      ),
    ]);

    await Promise.all(
      PREVIEW_TALKS.map(async (talk) => {
        const collectionId = requireSeedId(
          collectionIdsBySlug,
          'collection',
          talk.collectionSlug
        );
        const speakerId = requireSeedId(
          speakerIdsBySlug,
          'speaker',
          talk.speakerSlug
        );
        const talkId = await upsertTalk(ctx, collectionId, speakerId, talk);
        talkIdsBySlug.set(talk.slug, talkId);
      })
    );

    await Promise.all(
      PREVIEW_TALKS.map(async (talk) => {
        const talkId = requireSeedId(talkIdsBySlug, 'talk', talk.slug);
        const topicIds = talk.topicSlugs.map((topicSlug) =>
          requireSeedId(topicIdsBySlug, 'topic', topicSlug)
        );

        await upsertTalkTopics(ctx, talkId, topicIds);
      })
    );

    await Promise.all(
      PREVIEW_CLIPS.map(async (clip) => {
        const speakerId = requireSeedId(
          speakerIdsBySlug,
          'speaker',
          clip.speakerSlug
        );
        const talkId = requireSeedId(talkIdsBySlug, 'talk', clip.talkSlug);

        await upsertClip(ctx, speakerId, talkId, clip);
      })
    );

    return {
      clipCount: PREVIEW_CLIPS.length,
      collectionCount: PREVIEW_COLLECTIONS.length,
      speakerCount: PREVIEW_SPEAKERS.length,
      talkCount: PREVIEW_TALKS.length,
      topicCount: PREVIEW_TOPICS.length,
    };
  },
  returns: seedContentResultValidator,
});

export const seedPreviewUser = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    assertPreviewHost();

    const now = Date.now();
    const existingUser: unknown = await ctx.runQuery(
      components.betterAuth.adapter.findOne,
      {
        model: 'user',
        where: [
          {
            field: 'email',
            value: args.email,
          },
        ],
      }
    );
    const existingUserId = adapterRecordId(existingUser);

    if (existingUserId) {
      await upsertCredentialAccount(ctx, args.passwordHash, existingUserId);

      return 'updated';
    }

    const createdUser: unknown = await ctx.runMutation(
      components.betterAuth.adapter.create,
      {
        input: {
          data: {
            createdAt: now,
            email: args.email,
            emailVerified: true,
            name: args.name,
            role: 'user',
            updatedAt: now,
          },
          model: 'user',
        },
      }
    );
    const userId = adapterRecordId(createdUser);

    if (!userId) {
      throwValidationError('Preview user seed did not return a user id');
    }

    await upsertCredentialAccount(ctx, args.passwordHash, userId);

    return 'created';
  },
  returns: v.union(v.literal('created'), v.literal('updated')),
});

export const seedPreview = internalAction({
  args: {},
  handler: async (
    ctx
  ): Promise<{
    clipCount: number;
    collectionCount: number;
    speakerCount: number;
    talkCount: number;
    topicCount: number;
    userSeed: 'created' | 'skipped' | 'updated';
  }> => {
    assertPreviewHost();

    const content: {
      clipCount: number;
      collectionCount: number;
      speakerCount: number;
      talkCount: number;
      topicCount: number;
    } = await ctx.runMutation(internal.preview.seedContent, {});
    const email = process.env.PREVIEW_USER_EMAIL?.trim().toLowerCase() ?? '';
    const password = process.env.PREVIEW_USER_PASSWORD ?? '';

    if (!email.includes('@') || password.length === 0) {
      return {
        clipCount: content.clipCount,
        collectionCount: content.collectionCount,
        speakerCount: content.speakerCount,
        talkCount: content.talkCount,
        topicCount: content.topicCount,
        userSeed: 'skipped' as const,
      };
    }

    const userSeed: 'created' | 'updated' = await ctx.runMutation(
      internal.preview.seedPreviewUser,
      {
        email,
        name: 'Preview User',
        passwordHash: await hashPassword(password),
      }
    );

    return {
      clipCount: content.clipCount,
      collectionCount: content.collectionCount,
      speakerCount: content.speakerCount,
      talkCount: content.talkCount,
      topicCount: content.topicCount,
      userSeed,
    };
  },
  returns: seedContentResultValidator.extend({
    userSeed: v.union(
      v.literal('created'),
      v.literal('skipped'),
      v.literal('updated')
    ),
  }),
});
