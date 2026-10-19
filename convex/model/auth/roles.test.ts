import { describe, expect, it } from 'vitest';

import { api } from '../../_generated/api';
import { ErrorCodes } from '../../lib/errors';
import { createConvexTest, signInAs } from '../../test.setup';

const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';
const paginationOpts = {
  cursor: null,
  numItems: 10,
};

async function expectForbidden(promise: Promise<unknown>) {
  await expect(promise).rejects.toMatchObject({
    data: {
      errorCode: ErrorCodes.FORBIDDEN,
    },
  });
}

async function seedSpeakerAndTalk(t: ReturnType<typeof createConvexTest>) {
  return await t.run(async (ctx) => {
    const speakerId = await ctx.db.insert('speakers', {
      firstName: 'John',
      lastName: 'Bunyan',
      slug: 'john-bunyan',
    });
    const talkId = await ctx.db.insert('talks', {
      mediaUrl: MEDIA_URL,
      slug: 'grace-abounding',
      speakerId,
      status: 'published',
      title: 'Grace Abounding',
    });

    return { speakerId, talkId };
  });
}

describe('content mutations require admin', () => {
  it('rejects a signed-in non-admin and allows an admin', async () => {
    const t = createConvexTest();
    const { speakerId } = await seedSpeakerAndTalk(t);
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

    await expectForbidden(
      asMember.mutation(api.topics.createTopic, { title: 'Grace' })
    );
    await expectForbidden(
      asMember.mutation(api.speakers.createSpeaker, {
        firstName: 'John',
        lastName: 'Owen',
      })
    );
    await expectForbidden(
      asMember.mutation(api.collections.createCollection, {
        title: 'Pilgrim',
      })
    );
    await expectForbidden(
      asMember.mutation(api.clips.createClip, {
        mediaUrl: MEDIA_URL,
        title: 'A clip',
      })
    );
    await expectForbidden(
      asMember.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        speakerId,
        title: 'A talk',
      })
    );
    await expectForbidden(
      asMember.mutation(api.affiliateLinks.createAffiliateLink, {
        title: 'A book',
        type: 'book',
        url: 'https://example.test/book',
      })
    );

    await expect(
      asAdmin.mutation(api.topics.createTopic, { title: 'Grace' })
    ).resolves.toEqual(expect.anything());
    await expect(
      asAdmin.mutation(api.speakers.createSpeaker, {
        firstName: 'John',
        lastName: 'Owen',
      })
    ).resolves.toEqual(expect.anything());
    await expect(
      asAdmin.mutation(api.collections.createCollection, {
        title: 'Pilgrim',
      })
    ).resolves.toEqual(expect.anything());
    await expect(
      asAdmin.mutation(api.clips.createClip, {
        mediaUrl: MEDIA_URL,
        title: 'A clip',
      })
    ).resolves.toEqual(expect.anything());
    await expect(
      asAdmin.mutation(api.talks.createTalk, {
        mediaUrl: MEDIA_URL,
        speakerId,
        title: 'A talk',
      })
    ).resolves.toEqual(expect.anything());
    await expect(
      asAdmin.mutation(api.affiliateLinks.createAffiliateLink, {
        title: 'A book',
        type: 'book',
        url: 'https://example.test/book',
      })
    ).resolves.toEqual(expect.anything());
  });
});

describe('listAll queries require admin', () => {
  it('rejects a signed-in non-admin and allows an admin', async () => {
    const t = createConvexTest();
    await seedSpeakerAndTalk(t);
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

    await expectForbidden(
      asMember.query(api.talks.listAllTalks, {
        paginationOpts,
        status: 'all',
      })
    );
    await expectForbidden(asMember.query(api.topics.listAllTopics, {}));
    await expectForbidden(
      asMember.query(api.speakers.listAllSpeakers, { paginationOpts })
    );
    await expectForbidden(
      asMember.query(api.speakers.listAllSpeakersAdmin, {})
    );
    await expectForbidden(asMember.query(api.speakers.listAllSpeakersRaw, {}));
    await expectForbidden(
      asMember.query(api.clips.listAllClips, {
        paginationOpts,
        status: 'all',
      })
    );
    await expectForbidden(
      asMember.query(api.collections.listAllCollections, { paginationOpts })
    );

    await expect(
      asAdmin.query(api.talks.listAllTalks, {
        paginationOpts,
        status: 'all',
      })
    ).resolves.toMatchObject({
      isDone: true,
      page: [expect.objectContaining({ slug: 'grace-abounding' })],
    });
    await expect(asAdmin.query(api.topics.listAllTopics, {})).resolves.toEqual(
      []
    );
    await expect(
      asAdmin.query(api.speakers.listAllSpeakers, { paginationOpts })
    ).resolves.toMatchObject({
      page: [expect.objectContaining({ slug: 'john-bunyan' })],
    });
    await expect(
      asAdmin.query(api.speakers.listAllSpeakersAdmin, {})
    ).resolves.toEqual([
      expect.objectContaining({
        speaker: expect.objectContaining({ slug: 'john-bunyan' }),
      }),
    ]);
    await expect(
      asAdmin.query(api.speakers.listAllSpeakersRaw, {})
    ).resolves.toEqual([expect.objectContaining({ slug: 'john-bunyan' })]);
    await expect(
      asAdmin.query(api.clips.listAllClips, {
        paginationOpts,
        status: 'all',
      })
    ).resolves.toMatchObject({
      page: [],
    });
    await expect(
      asAdmin.query(api.collections.listAllCollections, { paginationOpts })
    ).resolves.toMatchObject({
      page: [],
    });
  });
});

describe('per-user mutations stay on the signed-in user', () => {
  it('does not let one user remove another user favorite', async () => {
    const t = createConvexTest();
    const { talkId } = await seedSpeakerAndTalk(t);
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
