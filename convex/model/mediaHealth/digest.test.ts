import { describe, expect, it } from 'vitest';

import {
  buildMediaHealthDigest,
  getMediaAdminEditPath,
  getMediaPublicPath,
  isUnnotifiedOpenCheck,
} from './digest';

const newTalk = {
  adminPath: '/talks/edit/talk1?status=archived',
  entityTable: 'talks' as const,
  firstBrokenAt: 1_700_000_000_000,
  mediaUrl: 'https://www.youtube.com/watch?v=abc',
  newStatus: 'private' as const,
  publicPath: '/talks/john-doe/first-talk',
  title: 'First Talk',
};

describe('buildMediaHealthDigest', () => {
  it('returns null when nothing is new', () => {
    expect(
      buildMediaHealthDigest({
        newItems: [],
        stillOpenCount: 4,
      })
    ).toBe(null);
  });

  it('keeps new items and the still-open count', () => {
    expect(
      buildMediaHealthDigest({
        newItems: [newTalk],
        stillOpenCount: 2,
      })
    ).toEqual({
      newItems: [newTalk],
      stillOpenCount: 2,
    });
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

  it('builds clip and talk paths', () => {
    expect(
      getMediaPublicPath({
        entityTable: 'clips',
        slug: 'second-clip',
      })
    ).toBe('/clips/second-clip');
    expect(
      getMediaPublicPath({
        entityTable: 'talks',
        slug: 'first-talk',
        speakerSlug: 'john-doe',
      })
    ).toBe('/talks/john-doe/first-talk');
  });
});

describe('getMediaAdminEditPath', () => {
  it('prefills archived on the edit path', () => {
    expect(getMediaAdminEditPath('talks', 'talk1')).toBe(
      '/talks/edit/talk1?status=archived'
    );
  });
});

describe('isUnnotifiedOpenCheck', () => {
  it('treats a first open break as new', () => {
    expect(
      isUnnotifiedOpenCheck({
        firstBrokenAt: 10,
        state: 'open',
        status: 'private',
      })
    ).toBe(true);
  });

  it('is quiet after a successful notify until it reopens', () => {
    expect(
      isUnnotifiedOpenCheck({
        firstBrokenAt: 10,
        lastNotifiedAt: 20,
        state: 'open',
        status: 'missing',
      })
    ).toBe(false);
    expect(
      isUnnotifiedOpenCheck({
        firstBrokenAt: 30,
        lastNotifiedAt: 20,
        state: 'open',
        status: 'missing',
      })
    ).toBe(true);
  });
});
