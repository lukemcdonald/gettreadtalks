import type { Id } from '../../_generated/dataModel';

import { describe, expect, it } from 'vitest';

import { internal } from '../../_generated/api';
import { createConvexTest } from '../../test.setup';
import {
  appendMediaHealthItem,
  buildMediaHealthDigest,
  getMediaPublicPath,
  partitionMediaHealthItems,
} from './digest';

const CHECKED_AT = 1_700_000_000_000;
const MEDIA_URL = 'https://www.youtube.com/watch?v=0SVTl4Xa5fY';

const talk = {
  entityId: 'talk1',
  entityTable: 'talks' as const,
  mediaUrl: MEDIA_URL,
  slug: 'first-talk',
  speakerSlug: 'john-doe',
  title: 'First Talk',
};

const digestItem = {
  adminPath: '/talks/edit/talk1?status=archived',
  checkId: 'checks:1' as Id<'mediaChecks'>,
  entityTable: 'talks' as const,
  mediaUrl: MEDIA_URL,
  newStatus: 'private' as const,
  publicPath: '/talks/john-doe/first-talk',
  title: 'First Talk',
};

async function upsert(
  t: ReturnType<typeof createConvexTest>,
  observedStatus: 'missing' | 'ok' | 'private',
  checkedAt = CHECKED_AT
) {
  return await t.mutation(internal.mediaHealth.upsertMediaCheck, {
    checkedAt,
    entityId: talk.entityId,
    entityTable: talk.entityTable,
    mediaUrl: MEDIA_URL,
    observedStatus,
  });
}

function digestFor(outcome: Awaited<ReturnType<typeof upsert>>) {
  return buildMediaHealthDigest(appendMediaHealthItem(talk, outcome, []));
}

describe('partitionMediaHealthItems', () => {
  it('splits new breaks from still unresolved', () => {
    expect(
      partitionMediaHealthItems([
        { ...digestItem, isNew: true, title: 'New break' },
        { ...digestItem, isNew: false, title: 'Still broken' },
      ])
    ).toEqual({
      newItems: [expect.objectContaining({ isNew: true, title: 'New break' })],
      unresolvedItems: [
        expect.objectContaining({ isNew: false, title: 'Still broken' }),
      ],
    });
  });
});

describe('buildMediaHealthDigest', () => {
  it('returns null when empty', () => {
    expect(buildMediaHealthDigest([])).toBe(null);
  });

  it('keeps unresolved items so the email can list them separately', () => {
    const digest = buildMediaHealthDigest([{ ...digestItem, isNew: false }]);

    expect(digest?.newItems).toEqual([]);
    expect(digest?.unresolvedItems).toEqual([
      expect.objectContaining({ isNew: false }),
    ]);
    expect(digest?.items).toHaveLength(1);
  });
});

describe('getMediaPublicPath', () => {
  it('returns null for a talk without a speaker slug', () => {
    expect(
      getMediaPublicPath({
        entityTable: 'talks',
        slug: 'orphan-talk',
      })
    ).toBe(null);
  });
});

describe('media health digest', () => {
  it('emails a first break once', async () => {
    const t = createConvexTest();
    const digest = digestFor(await upsert(t, 'private'));

    expect(digest?.newItems).toEqual([
      {
        adminPath: '/talks/edit/talk1?status=archived',
        checkId: expect.any(String),
        entityTable: 'talks',
        isNew: true,
        mediaUrl: MEDIA_URL,
        newStatus: 'private',
        publicPath: '/talks/john-doe/first-talk',
        title: 'First Talk',
      },
    ]);
    expect(digest?.unresolvedItems).toEqual([]);
  });

  it('lists an already-notified break as still unresolved', async () => {
    const t = createConvexTest();
    const first = await upsert(t, 'private');

    await t.mutation(internal.mediaHealth.stampMediaChecksNotified, {
      checkIds: [first.checkId],
      notifiedAt: CHECKED_AT + 1,
    });

    const digest = digestFor(await upsert(t, 'private', CHECKED_AT + 2));

    expect(digest?.newItems).toEqual([]);
    expect(digest?.unresolvedItems).toEqual([
      expect.objectContaining({
        isNew: false,
        newStatus: 'private',
      }),
    ]);
  });

  it('omits a recovered break from the digest', async () => {
    const t = createConvexTest();
    await upsert(t, 'private');

    expect(digestFor(await upsert(t, 'ok'))).toBe(null);
  });

  it('emails again after recovery then a re-break', async () => {
    const t = createConvexTest();
    const first = await upsert(t, 'private');

    await t.mutation(internal.mediaHealth.stampMediaChecksNotified, {
      checkIds: [first.checkId],
      notifiedAt: CHECKED_AT + 1,
    });

    expect(digestFor(await upsert(t, 'ok', CHECKED_AT + 2))).toBe(null);

    const digest = digestFor(await upsert(t, 'missing', CHECKED_AT + 3));

    expect(digest?.newItems).toEqual([
      expect.objectContaining({
        isNew: true,
        newStatus: 'missing',
      }),
    ]);
  });
});
