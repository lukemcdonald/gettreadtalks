import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import { ErrorCodes } from '../../lib/errors';
import { createConvexTest, signInAs } from '../../test.setup';
import { insertAffiliateLink } from '../affiliateLinks/factory';
import { insertClip } from '../clips/factory';
import { insertCollection } from '../collections/factory';
import { insertSpeaker } from '../speakers/factory';
import {
  insertTalk,
  insertTalkStudy,
  insertTalkTranscript,
} from '../talks/factory';
import { insertTalkOnTopic, insertTopic } from '../topics/factory';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';
const paginationOpts = {
  cursor: null,
  numItems: 10,
};

type TestClient = Pick<
  ReturnType<typeof createConvexTest>,
  'action' | 'mutation' | 'query'
>;
type Seed = Awaited<ReturnType<typeof seedCatalog>>;

async function expectRejected(
  promise: Promise<unknown>,
  errorCode: typeof ErrorCodes.AUTH_REQUIRED | typeof ErrorCodes.FORBIDDEN
) {
  await expect(promise).rejects.toMatchObject({
    data: {
      errorCode,
    },
  });
}

async function seedCatalog(t: ReturnType<typeof createConvexTest>) {
  return await t.run(async (ctx) => {
    const speakerId = await insertSpeaker(ctx);
    const unusedSpeakerId = await insertSpeaker(ctx, {
      firstName: 'Unused',
      lastName: 'Speaker',
      slug: 'unused-speaker',
    });
    const talkId = await insertTalk(ctx, { speakerId });
    await insertTalkStudy(ctx, { talkId });
    const topicId = await insertTopic(ctx);
    const unusedTopicId = await insertTopic(ctx, {
      slug: 'unused-topic',
      title: 'Unused Topic',
    });
    await insertTalkOnTopic(ctx, { talkId, topicId });
    await insertTalkTranscript(ctx, { talkId });
    const collectionId = await insertCollection(ctx, {
      slug: 'unused-collection',
      title: 'Unused Collection',
    });
    const clipId = await insertClip(ctx);
    const affiliateLinkId = await insertAffiliateLink(ctx);

    return {
      affiliateLinkId,
      clipId,
      collectionId,
      speakerId,
      talkId,
      topicId,
      unusedSpeakerId,
      unusedTopicId,
    };
  });
}

const gatedFunctions: {
  call: (client: TestClient, seed: Seed) => Promise<unknown>;
  name: string;
}[] = [
  {
    call: (client) =>
      client.mutation(api.affiliateLinks.createAffiliateLink, {
        title: 'A new book',
        type: 'book',
        url: 'https://example.test/new-book',
      }),
    name: 'affiliateLinks.createAffiliateLink',
  },
  {
    call: (client, seed) =>
      client.mutation(api.affiliateLinks.destroyAffiliateLink, {
        affiliateLinkId: seed.affiliateLinkId,
      }),
    name: 'affiliateLinks.destroyAffiliateLink',
  },
  {
    call: (client, seed) =>
      client.mutation(api.affiliateLinks.updateAffiliateLink, {
        affiliateLinkId: seed.affiliateLinkId,
        title: 'Updated book',
      }),
    name: 'affiliateLinks.updateAffiliateLink',
  },
  {
    call: (client, seed) =>
      client.mutation(api.clips.archiveClip, { clipId: seed.clipId }),
    name: 'clips.archiveClip',
  },
  {
    call: (client) =>
      client.mutation(api.clips.createClip, {
        mediaUrl: MEDIA_URL,
        title: 'A new clip',
      }),
    name: 'clips.createClip',
  },
  {
    call: (client, seed) =>
      client.mutation(api.clips.destroyClip, { clipId: seed.clipId }),
    name: 'clips.destroyClip',
  },
  {
    call: (client, seed) =>
      client.query(api.clips.getClip, { id: seed.clipId }),
    name: 'clips.getClip',
  },
  {
    call: (client) =>
      client.query(api.clips.listAllClips, {
        paginationOpts,
        status: 'all',
      }),
    name: 'clips.listAllClips',
  },
  {
    call: (client, seed) =>
      client.mutation(api.clips.updateClip, {
        clipId: seed.clipId,
        title: 'Updated clip',
      }),
    name: 'clips.updateClip',
  },
  {
    call: (client) =>
      client.mutation(api.collections.createCollection, {
        title: 'A new collection',
      }),
    name: 'collections.createCollection',
  },
  {
    call: (client, seed) =>
      client.mutation(api.collections.destroyCollection, {
        collectionId: seed.collectionId,
      }),
    name: 'collections.destroyCollection',
  },
  {
    call: (client, seed) =>
      client.query(api.collections.getCollection, {
        collectionId: seed.collectionId,
      }),
    name: 'collections.getCollection',
  },
  {
    call: (client) =>
      client.query(api.collections.listAllCollections, { paginationOpts }),
    name: 'collections.listAllCollections',
  },
  {
    call: (client, seed) =>
      client.mutation(api.collections.updateCollection, {
        collectionId: seed.collectionId,
        title: 'Updated collection',
      }),
    name: 'collections.updateCollection',
  },
  {
    call: (client) =>
      client.mutation(api.speakers.createSpeaker, {
        firstName: 'John',
        lastName: 'Owen',
      }),
    name: 'speakers.createSpeaker',
  },
  {
    call: (client, seed) =>
      client.mutation(api.speakers.destroySpeaker, {
        speakerId: seed.unusedSpeakerId,
      }),
    name: 'speakers.destroySpeaker',
  },
  {
    call: (client, seed) =>
      client.query(api.speakers.getSpeaker, { speakerId: seed.speakerId }),
    name: 'speakers.getSpeaker',
  },
  {
    call: (client) => client.query(api.speakers.getSpeakersCount, {}),
    name: 'speakers.getSpeakersCount',
  },
  {
    call: (client) =>
      client.query(api.speakers.listAllSpeakers, { paginationOpts }),
    name: 'speakers.listAllSpeakers',
  },
  {
    call: (client) => client.query(api.speakers.listAllSpeakersAdmin, {}),
    name: 'speakers.listAllSpeakersAdmin',
  },
  {
    call: (client) => client.query(api.speakers.listAllSpeakersRaw, {}),
    name: 'speakers.listAllSpeakersRaw',
  },
  {
    call: (client, seed) =>
      client.mutation(api.speakers.updateSpeaker, {
        firstName: 'Updated',
        speakerId: seed.speakerId,
      }),
    name: 'speakers.updateSpeaker',
  },
  {
    call: (client, seed) =>
      client.mutation(api.talks.archiveTalk, { talkId: seed.talkId }),
    name: 'talks.archiveTalk',
  },
  {
    call: (client, seed) =>
      client.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        speakerId: seed.speakerId,
        title: 'A new talk',
      }),
    name: 'talks.createTalk',
  },
  {
    call: (client, seed) =>
      client.mutation(api.talks.createTalkTranscriptFetch, {
        confirmRefetch: true,
        talkId: seed.talkId,
      }),
    name: 'talks.createTalkTranscriptFetch',
  },
  {
    call: (client, seed) =>
      client.mutation(api.talks.destroyTalk, { talkId: seed.talkId }),
    name: 'talks.destroyTalk',
  },
  {
    call: (client, seed) =>
      client.action(api.talks.generateTalkSummary, { talkId: seed.talkId }),
    name: 'talks.generateTalkSummary',
  },
  {
    call: (client, seed) =>
      client.query(api.talks.getTalk, { id: seed.talkId }),
    name: 'talks.getTalk',
  },
  {
    call: (client, seed) =>
      client.query(api.talks.getTalkStudy, { talkId: seed.talkId }),
    name: 'talks.getTalkStudy',
  },
  {
    call: (client, seed) =>
      client.query(api.talks.getTalkTranscript, { talkId: seed.talkId }),
    name: 'talks.getTalkTranscript',
  },
  {
    call: (client, seed) =>
      client.query(api.talks.getTalkTranscriptFetch, { talkId: seed.talkId }),
    name: 'talks.getTalkTranscriptFetch',
  },
  {
    call: (client, seed) =>
      client.query(api.talks.getTalkTranscriptText, { talkId: seed.talkId }),
    name: 'talks.getTalkTranscriptText',
  },
  {
    call: (client) =>
      client.query(api.talks.listAllTalks, {
        paginationOpts,
        status: 'all',
      }),
    name: 'talks.listAllTalks',
  },
  {
    call: (client) => client.query(api.talks.listDraftTalkStudies, {}),
    name: 'talks.listDraftTalkStudies',
  },
  {
    call: (client, seed) =>
      client.query(api.talks.listTalkTopics, { talkId: seed.talkId }),
    name: 'talks.listTalkTopics',
  },
  {
    call: (client) => client.query(api.talks.listTalkTranscripts, {}),
    name: 'talks.listTalkTranscripts',
  },
  {
    call: (client) => client.query(api.talks.listTalksWithoutTranscript, {}),
    name: 'talks.listTalksWithoutTranscript',
  },
  {
    call: (client, seed) =>
      client.mutation(api.talks.updateTalk, {
        talkId: seed.talkId,
        title: 'Updated talk',
      }),
    name: 'talks.updateTalk',
  },
  {
    call: (client, seed) =>
      client.mutation(api.talks.updateTalkStudy, {
        studyStatus: 'published',
        summary: 'Updated summary',
        talkId: seed.talkId,
      }),
    name: 'talks.updateTalkStudy',
  },
  {
    call: (client, seed) =>
      client.mutation(api.talks.updateTalkTranscript, {
        talkId: seed.talkId,
        text: 'Updated transcript',
      }),
    name: 'talks.updateTalkTranscript',
  },
  {
    call: (client, seed) =>
      client.mutation(api.topics.addTalkToTopic, {
        talkId: seed.talkId,
        topicId: seed.unusedTopicId,
      }),
    name: 'topics.addTalkToTopic',
  },
  {
    call: (client) =>
      client.mutation(api.topics.createTopic, { title: 'A new topic' }),
    name: 'topics.createTopic',
  },
  {
    call: (client, seed) =>
      client.mutation(api.topics.destroyTopic, { id: seed.unusedTopicId }),
    name: 'topics.destroyTopic',
  },
  {
    call: (client, seed) =>
      client.query(api.topics.getTopic, { id: seed.topicId }),
    name: 'topics.getTopic',
  },
  {
    call: (client) => client.query(api.topics.listAllTopics, {}),
    name: 'topics.listAllTopics',
  },
  {
    call: (client, seed) =>
      client.mutation(api.topics.removeTalkFromTopic, {
        talkId: seed.talkId,
        topicId: seed.topicId,
      }),
    name: 'topics.removeTalkFromTopic',
  },
  {
    call: (client, seed) =>
      client.mutation(api.topics.updateTopic, {
        id: seed.topicId,
        title: 'Updated topic',
      }),
    name: 'topics.updateTopic',
  },
];

describe('admin-gated content functions', () => {
  it.each(gatedFunctions)(
    '$name rejects signed-out and member callers, and allows admin',
    async ({ call }) => {
      const t = createConvexTest();
      const seed = await seedCatalog(t);
      const { asUser: asMember } = await signInAs(t, {
        email: 'member@example.test',
        name: 'Member',
        role: 'user',
      });
      const { asUser: asAdmin } = await signInAs(t, {
        email: 'admin@example.test',
        name: 'Admin',
        role: 'admin',
      });

      await expectRejected(call(t, seed), ErrorCodes.AUTH_REQUIRED);
      await expectRejected(call(asMember, seed), ErrorCodes.FORBIDDEN);
      await call(asAdmin, seed);
    }
  );
});

describe('per-user mutations stay on the signed-in user', () => {
  it('does not let one user remove another user favorite', async () => {
    const t = createConvexTest();
    const { talkId } = await seedCatalog(t);
    const { asUser: asOwner } = await signInAs(t, {
      email: 'owner@example.test',
      name: 'Owner',
      role: 'user',
    });
    const { asUser: asOther } = await signInAs(t, {
      email: 'other@example.test',
      name: 'Other',
      role: 'user',
    });

    await asOwner.mutation(api.users.favoriteTalk, { talkId });

    await expect(
      asOther.mutation(api.users.unfavoriteTalk, { talkId })
    ).rejects.toMatchObject({
      data: {
        errorCode: ErrorCodes.NOT_FOUND,
      },
    });

    const favorites = await asOwner.query(api.users.listUserFavorites, {});

    expect(favorites.talks).toEqual([
      expect.objectContaining({
        _id: talkId,
      }),
    ]);
  });
});
