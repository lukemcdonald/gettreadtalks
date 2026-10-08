import type { Id, TableNames } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

import { hashPassword } from 'better-auth/crypto';
import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { components, internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';
import { throwForbidden, throwValidationError } from './lib/errors';

const PREVIEW_MEDIA_URL = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

const PREVIEW_SPEAKERS = [
  {
    description: 'Fixture speaker for Vercel Convex previews.',
    featured: true,
    firstName: 'Ada',
    lastName: 'Preview',
    ministry: 'Preview Chapel',
    role: 'Pastor' as const,
    slug: 'ada-preview',
    websiteUrl: 'https://example.com/ada-preview',
  },
  {
    description: 'Second fixture speaker so admin search has a name to match.',
    featured: false,
    firstName: 'Theo',
    lastName: 'Sample',
    ministry: 'Sample Institute',
    role: 'Theologian' as const,
    slug: 'theo-sample',
    websiteUrl: 'https://example.com/theo-sample',
  },
];

const PREVIEW_TOPICS = [
  {
    slug: 'preview-faith',
    title: 'Preview Faith',
  },
  {
    slug: 'preview-grace',
    title: 'Preview Grace',
  },
];

const PREVIEW_COLLECTIONS = [
  {
    description: 'Fixture series with talks from both preview speakers.',
    slug: 'preview-conference',
    title: 'Preview Conference',
  },
  {
    description: 'Fixture series of talks by Ada Preview.',
    slug: 'preview-series',
    title: 'Preview Series',
  },
];

const PREVIEW_TALKS = [
  {
    collectionOrder: 1,
    collectionSlug: 'preview-conference',
    description: 'Featured fixture talk for Ada Preview.',
    featured: true,
    publishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
    scripture: 'Ephesians 2:8-9',
    slug: 'preview-featured-talk',
    speakerSlug: 'ada-preview',
    status: 'published' as const,
    title: 'Preview Featured Talk',
    topicSlugs: ['preview-grace'],
  },
  {
    collectionOrder: 1,
    collectionSlug: 'preview-series',
    description: 'Published fixture talk for Ada Preview.',
    featured: false,
    publishedAt: Date.parse('2024-06-02T12:00:00.000Z'),
    scripture: 'Romans 8:28',
    slug: 'preview-published-talk',
    speakerSlug: 'ada-preview',
    status: 'published' as const,
    title: 'Preview Published Talk',
    topicSlugs: ['preview-faith'],
  },
  {
    collectionOrder: 2,
    collectionSlug: 'preview-series',
    description: 'Second published fixture talk for Ada Preview.',
    featured: false,
    publishedAt: Date.parse('2024-06-01T12:00:00.000Z'),
    scripture: 'John 1:14',
    slug: 'preview-evening-talk',
    speakerSlug: 'ada-preview',
    status: 'published' as const,
    title: 'Preview Evening Talk',
    topicSlugs: ['preview-faith', 'preview-grace'],
  },
  {
    collectionOrder: 2,
    collectionSlug: 'preview-conference',
    description: 'Only published fixture talk for Theo Sample.',
    featured: false,
    publishedAt: Date.parse('2024-06-04T12:00:00.000Z'),
    scripture: 'Psalm 23:1-3',
    slug: 'preview-backlog-talk',
    speakerSlug: 'theo-sample',
    status: 'published' as const,
    title: 'Preview Sample Talk',
    topicSlugs: ['preview-faith', 'preview-grace'],
  },
];

const seedContentResultValidator = v.object({
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
    mediaUrl: PREVIEW_MEDIA_URL,
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

    return {
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
    collectionCount: number;
    speakerCount: number;
    talkCount: number;
    topicCount: number;
    userSeed: 'created' | 'skipped' | 'updated';
  }> => {
    assertPreviewHost();

    const content: {
      collectionCount: number;
      speakerCount: number;
      talkCount: number;
      topicCount: number;
    } = await ctx.runMutation(internal.preview.seedContent, {});
    const email = process.env.PREVIEW_USER_EMAIL?.trim().toLowerCase() ?? '';
    const password = process.env.PREVIEW_USER_PASSWORD ?? '';

    if (!email.includes('@') || password.length === 0) {
      return {
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
