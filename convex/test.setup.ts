/// <reference types="vite/client" />

import { convexTest } from 'convex-test';

import schema from './schema';

const modules = import.meta.glob([
  './**/*.{js,ts}',
  '!./**/*.d.ts',
  '!./**/*.spec.ts',
  '!./**/*.test.ts',
  '!./betterAuth/**',
]);

export function createConvexTest() {
  return convexTest(schema, modules);
}

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

export const visibilitySlugs = {
  clipOnDraftTalk: 'clip-on-draft-talk',
  clipOnPublishedTalk: 'clip-on-published-talk',
  draftSpeaker: 'draft-only-speaker',
  draftTalk: 'grace-draft',
  publishedSpeaker: 'john-bunyan',
  publishedTalk: 'grace-abounding',
  standaloneClip: 'standalone-grace-clip',
};

export async function seedVisibilityCatalog(
  t: ReturnType<typeof createConvexTest>
) {
  await t.run(async (ctx) => {
    const draftSpeakerId = await ctx.db.insert('speakers', {
      firstName: 'Draft',
      lastName: 'Only',
      slug: visibilitySlugs.draftSpeaker,
    });
    const publishedSpeakerId = await ctx.db.insert('speakers', {
      firstName: 'John',
      lastName: 'Bunyan',
      slug: visibilitySlugs.publishedSpeaker,
    });

    const draftTalkId = await ctx.db.insert('talks', {
      mediaUrl: MEDIA_URL,
      slug: visibilitySlugs.draftTalk,
      speakerId: publishedSpeakerId,
      status: 'backlog',
      title: 'Grace Draft',
    });
    const publishedTalkId = await ctx.db.insert('talks', {
      mediaUrl: MEDIA_URL,
      publishedAt: Date.parse('2024-06-01T12:00:00.000Z'),
      slug: visibilitySlugs.publishedTalk,
      speakerId: publishedSpeakerId,
      status: 'published',
      title: 'Grace Abounding',
    });

    await ctx.db.insert('talks', {
      mediaUrl: MEDIA_URL,
      slug: 'unpublished-from-draft-speaker',
      speakerId: draftSpeakerId,
      status: 'backlog',
      title: 'Hidden Talk',
    });

    await ctx.db.insert('clips', {
      mediaUrl: MEDIA_URL,
      publishedAt: Date.parse('2024-06-01T12:30:00.000Z'),
      slug: visibilitySlugs.clipOnPublishedTalk,
      speakerId: publishedSpeakerId,
      status: 'published',
      talkId: publishedTalkId,
      title: 'Grace Clip',
    });
    await ctx.db.insert('clips', {
      mediaUrl: MEDIA_URL,
      publishedAt: Date.parse('2024-06-01T12:45:00.000Z'),
      slug: visibilitySlugs.clipOnDraftTalk,
      speakerId: publishedSpeakerId,
      status: 'published',
      talkId: draftTalkId,
      title: 'Grace Clip Draft',
    });
    await ctx.db.insert('clips', {
      mediaUrl: MEDIA_URL,
      publishedAt: Date.parse('2024-06-01T13:00:00.000Z'),
      slug: visibilitySlugs.standaloneClip,
      speakerId: publishedSpeakerId,
      status: 'published',
      title: 'Standalone Grace Clip',
    });
  });
}
