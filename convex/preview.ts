import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

import { getOneFrom } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';

import { internal } from './_generated/api';
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

export const seedPreview = internalAction({
  args: {},
  handler: async (ctx) => {
    assertPreviewHost();

    const content: {
      speakerCount: number;
      talkCount: number;
    } = await ctx.runMutation(internal.preview.seedContent, {});

    return {
      speakerCount: content.speakerCount,
      talkCount: content.talkCount,
    };
  },
  returns: v.object({
    speakerCount: v.number(),
    talkCount: v.number(),
  }),
});
