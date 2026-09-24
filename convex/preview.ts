import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

import { hashPassword } from 'better-auth/crypto';
import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { components, internal } from './_generated/api';
import { internalAction, internalMutation } from './_generated/server';
import { throwForbidden, throwValidationError } from './lib/errors';
import { getPublishedAtForStatus } from './lib/utils';

const PREVIEW_MEDIA_URL = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

const PREVIEW_SPEAKERS = [
  {
    description: 'Fixture speaker for Vercel Convex previews.',
    featured: true,
    firstName: 'Ada',
    lastName: 'Preview',
    role: 'Pastor' as const,
    slug: 'ada-preview',
  },
  {
    description: 'Second fixture speaker so admin search has a name to match.',
    featured: false,
    firstName: 'Theo',
    lastName: 'Sample',
    role: 'Theologian' as const,
    slug: 'theo-sample',
  },
];

const PREVIEW_TALKS = [
  {
    featured: true,
    slug: 'preview-featured-talk',
    speakerSlug: 'ada-preview',
    status: 'published' as const,
    title: 'Preview Featured Talk',
  },
  {
    featured: false,
    slug: 'preview-published-talk',
    speakerSlug: 'ada-preview',
    status: 'published' as const,
    title: 'Preview Published Talk',
  },
  {
    featured: false,
    slug: 'preview-backlog-talk',
    speakerSlug: 'theo-sample',
    status: 'backlog' as const,
    title: 'Preview Backlog Talk',
  },
];

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
      role: speaker.role,
      updatedAt: Date.now(),
    });

    return existing._id;
  }

  return await ctx.db.insert('speakers', speaker);
}

async function upsertTalk(
  ctx: MutationCtx,
  speakerId: Id<'speakers'>,
  talk: (typeof PREVIEW_TALKS)[number]
): Promise<Id<'talks'>> {
  const existing = await getOneFrom(ctx.db, 'talks', 'by_slug', talk.slug);
  const publishedAt = getPublishedAtForStatus(
    talk.status,
    existing?.publishedAt
  );

  if (existing) {
    await ctx.db.patch(existing._id, {
      featured: talk.featured,
      mediaUrl: PREVIEW_MEDIA_URL,
      publishedAt,
      speakerId,
      status: talk.status,
      title: talk.title,
      updatedAt: Date.now(),
    });

    return existing._id;
  }

  return await ctx.db.insert('talks', {
    featured: talk.featured,
    mediaUrl: PREVIEW_MEDIA_URL,
    publishedAt,
    slug: talk.slug,
    speakerId,
    status: talk.status,
    title: talk.title,
  });
}

export const seedContent = internalMutation({
  args: {},
  handler: async (ctx) => {
    assertPreviewHost();

    const speakerIdsBySlug = new Map<string, Id<'speakers'>>();

    await Promise.all(
      PREVIEW_SPEAKERS.map(async (speaker) => {
        const speakerId = await upsertSpeaker(ctx, speaker);
        speakerIdsBySlug.set(speaker.slug, speakerId);
      })
    );

    await Promise.all(
      PREVIEW_TALKS.map(async (talk) => {
        const speakerId = speakerIdsBySlug.get(talk.speakerSlug);

        if (!speakerId) {
          throwValidationError(`Missing seed speaker ${talk.speakerSlug}`);
        }

        await upsertTalk(ctx, speakerId, talk);
      })
    );

    return {
      speakerCount: PREVIEW_SPEAKERS.length,
      talkCount: PREVIEW_TALKS.length,
    };
  },
  returns: v.object({
    speakerCount: v.number(),
    talkCount: v.number(),
  }),
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
    speakerCount: number;
    talkCount: number;
    userSeed: 'created' | 'skipped' | 'updated';
  }> => {
    assertPreviewHost();

    const content: {
      speakerCount: number;
      talkCount: number;
    } = await ctx.runMutation(internal.preview.seedContent, {});
    const email = process.env.PREVIEW_USER_EMAIL?.trim().toLowerCase() ?? '';
    const password = process.env.PREVIEW_USER_PASSWORD ?? '';

    if (!email.includes('@') || password.length === 0) {
      return {
        speakerCount: content.speakerCount,
        talkCount: content.talkCount,
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
      speakerCount: content.speakerCount,
      talkCount: content.talkCount,
      userSeed,
    };
  },
  returns: v.object({
    speakerCount: v.number(),
    talkCount: v.number(),
    userSeed: v.union(
      v.literal('created'),
      v.literal('skipped'),
      v.literal('updated')
    ),
  }),
});
