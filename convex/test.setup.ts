/// <reference types="vite/client" />

import { convexTest } from 'convex-test';

import { components } from './_generated/api';
import betterAuthSchema from './betterAuth/schema';
import { insertClip } from './model/clips/test-factory.fixture';
import { insertCollection } from './model/collections/test-factory.fixture';
import { insertSpeaker } from './model/speakers/test-factory.fixture';
import { insertTalk } from './model/talks/test-factory.fixture';
import {
  insertTalkOnTopic,
  insertTopic,
} from './model/topics/test-factory.fixture';
import schema from './schema';

const modules = import.meta.glob([
  './**/*.{js,ts}',
  '!./**/*.d.ts',
  '!./**/*.fixture.ts',
  '!./**/*.test.ts',
  '!./**/test-*.ts',
  '!./betterAuth/**',
]);

const betterAuthModules = import.meta.glob([
  './betterAuth/**/*.ts',
  '!./betterAuth/**/*.d.ts',
]);

export function createConvexTest() {
  const t = convexTest(schema, modules);
  t.registerComponent('betterAuth', betterAuthSchema, betterAuthModules);

  return t;
}

type ConvexTest = ReturnType<typeof createConvexTest>;

export async function signInAs(
  t: ConvexTest,
  params: {
    email: string;
    name: string;
    role: 'admin' | 'user';
  }
) {
  const now = Date.now();
  const { email, name, role } = params;

  const ids = await t.run(async (ctx) => {
    const createdUser = await ctx.runMutation(
      components.betterAuth.adapter.create,
      {
        input: {
          data: {
            createdAt: now,
            email,
            emailVerified: true,
            name,
            role,
            updatedAt: now,
          },
          model: 'user',
        },
      }
    );
    const userId = createdUser._id;
    const createdSession = await ctx.runMutation(
      components.betterAuth.adapter.create,
      {
        input: {
          data: {
            createdAt: now,
            expiresAt: now + 60 * 60 * 1000,
            token: `test-token-${userId}`,
            updatedAt: now,
            userId,
          },
          model: 'session',
        },
      }
    );

    return {
      sessionId: createdSession._id,
      userId,
    };
  });

  return {
    asUser: t.withIdentity({
      sessionId: ids.sessionId,
      subject: ids.userId,
    }),
    userId: ids.userId,
  };
}

export async function signInAsPasswordUser(
  t: ConvexTest,
  params: {
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'user';
  }
) {
  const { hashPassword } = await import('better-auth/crypto');
  const passwordHash = await hashPassword(params.password);
  const signedIn = await signInAs(t, {
    email: params.email,
    name: params.name,
    role: params.role,
  });

  await t.run(async (ctx) => {
    await ctx.runMutation(components.betterAuth.adapter.create, {
      input: {
        data: {
          accountId: signedIn.userId,
          createdAt: Date.now(),
          password: passwordHash,
          providerId: 'credential',
          updatedAt: Date.now(),
          userId: signedIn.userId,
        },
        model: 'account',
      },
    });
  });

  return signedIn;
}

export const visibilitySlugs = {
  clipOnDraftTalk: 'clip-on-draft-talk',
  clipOnPublishedTalk: 'clip-on-published-talk',
  draftSpeaker: 'draft-only-speaker',
  draftTalk: 'grace-draft',
  emptyCollection: 'empty-collection',
  emptyTopic: 'empty-topic',
  publishedCollection: 'published-collection',
  publishedSpeaker: 'john-bunyan',
  publishedTalk: 'grace-abounding',
  publishedTopic: 'published-topic',
  standaloneClip: 'standalone-grace-clip',
  unpublishedOnlyCollection: 'unpublished-only-collection',
  unpublishedOnlyTopic: 'unpublished-only-topic',
};

export async function seedVisibilityCatalog(
  t: ReturnType<typeof createConvexTest>
) {
  await t.run(async (ctx) => {
    const draftSpeakerId = await insertSpeaker(ctx, {
      firstName: 'Draft',
      lastName: 'Only',
      slug: visibilitySlugs.draftSpeaker,
    });
    const publishedSpeakerId = await insertSpeaker(ctx, {
      slug: visibilitySlugs.publishedSpeaker,
    });

    await insertCollection(ctx, {
      slug: visibilitySlugs.emptyCollection,
      title: 'Empty Collection',
    });
    const publishedCollectionId = await insertCollection(ctx, {
      slug: visibilitySlugs.publishedCollection,
      title: 'Published Collection',
    });
    const unpublishedOnlyCollectionId = await insertCollection(ctx, {
      slug: visibilitySlugs.unpublishedOnlyCollection,
      title: 'Unpublished Collection',
    });

    await insertTopic(ctx, {
      slug: visibilitySlugs.emptyTopic,
      title: 'Empty Topic',
    });
    const publishedTopicId = await insertTopic(ctx, {
      slug: visibilitySlugs.publishedTopic,
      title: 'Published Topic',
    });
    const unpublishedOnlyTopicId = await insertTopic(ctx, {
      slug: visibilitySlugs.unpublishedOnlyTopic,
      title: 'Unpublished Topic',
    });

    const draftTalkId = await insertTalk(ctx, {
      collectionId: unpublishedOnlyCollectionId,
      slug: visibilitySlugs.draftTalk,
      speakerId: publishedSpeakerId,
      status: 'backlog',
      title: 'Grace Draft',
    });
    const publishedTalkId = await insertTalk(ctx, {
      collectionId: publishedCollectionId,
      publishedAt: Date.parse('2024-06-01T12:00:00.000Z'),
      scripture: 'Romans 5:1-2',
      slug: visibilitySlugs.publishedTalk,
      speakerId: publishedSpeakerId,
    });

    await insertTalk(ctx, {
      slug: 'unpublished-from-draft-speaker',
      speakerId: draftSpeakerId,
      status: 'backlog',
      title: 'Hidden Talk',
    });

    await insertClip(ctx, {
      publishedAt: Date.parse('2024-06-01T12:30:00.000Z'),
      slug: visibilitySlugs.clipOnPublishedTalk,
      speakerId: publishedSpeakerId,
      talkId: publishedTalkId,
      title: 'Grace Clip',
    });
    await insertClip(ctx, {
      publishedAt: Date.parse('2024-06-01T12:45:00.000Z'),
      slug: visibilitySlugs.clipOnDraftTalk,
      speakerId: publishedSpeakerId,
      talkId: draftTalkId,
      title: 'Grace Clip Draft',
    });
    await insertClip(ctx, {
      publishedAt: Date.parse('2024-06-01T13:00:00.000Z'),
      slug: visibilitySlugs.standaloneClip,
      speakerId: publishedSpeakerId,
      title: 'Standalone Grace Clip',
    });

    await insertTalkOnTopic(ctx, {
      talkId: publishedTalkId,
      topicId: publishedTopicId,
    });
    await insertTalkOnTopic(ctx, {
      talkId: draftTalkId,
      topicId: unpublishedOnlyTopicId,
    });
  });
}
