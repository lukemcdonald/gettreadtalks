import { describe, expect, it } from 'vitest';

import {
  getMediaAdminEditPath,
  getMediaPublicPath,
  isUnnotifiedOpenCheck,
} from './digest';

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
