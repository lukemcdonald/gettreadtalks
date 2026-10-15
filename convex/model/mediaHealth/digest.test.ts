import { describe, expect, it } from 'vitest';

import {
  appendMediaHealthItem,
  buildMediaHealthDigest,
  getMediaPublicPath,
} from './digest';

const digestItem = {
  adminPath: '/talks/edit/talk1?status=archived',
  entityTable: 'talks' as const,
  isNew: true,
  mediaUrl: 'https://www.youtube.com/watch?v=abc',
  newStatus: 'private' as const,
  previousStatus: 'ok' as const,
  publicPath: '/talks/john-doe/first-talk',
  title: 'First Talk',
};

const firstTalkInput = {
  entityId: 'talk1',
  entityTable: 'talks' as const,
  mediaUrl: 'https://www.youtube.com/watch?v=abc',
  slug: 'first-talk',
  speakerSlug: 'john-doe',
  title: 'First Talk',
};

const stillBrokenClipInput = {
  entityId: 'clip1',
  entityTable: 'clips' as const,
  mediaUrl: 'https://vimeo.com/1',
  slug: 'second-clip',
  title: 'Second Clip',
};

const firstPrivateTalkInput = {
  entityId: 'talk2',
  entityTable: 'talks' as const,
  mediaUrl: 'https://www.youtube.com/watch?v=def',
  slug: 'new-talk',
  speakerSlug: 'mary-smith',
  title: 'New Talk',
};

const healthyTalkInput = {
  entityId: 'talk3',
  entityTable: 'talks' as const,
  mediaUrl: 'https://www.youtube.com/watch?v=ghi',
  slug: 'healthy-talk',
  speakerSlug: 'john-doe',
  title: 'Healthy Talk',
};

function firstAppendedItem(
  input: Parameters<typeof appendMediaHealthItem>[0],
  outcome: Parameters<typeof appendMediaHealthItem>[1]
) {
  const items = appendMediaHealthItem(input, outcome, []);
  const [item] = items;

  expect(items.length).toBe(1);
  if (!item) {
    throw new Error('expected digest item');
  }

  return item;
}

describe('buildMediaHealthDigest', () => {
  it('returns the items when any exist', () => {
    const items = [digestItem];

    expect(buildMediaHealthDigest(items)).toEqual(items);
  });

  it('returns null when empty', () => {
    expect(buildMediaHealthDigest([])).toBe(null);
  });
});

describe('getMediaPublicPath', () => {
  it('builds talk and clip page paths', () => {
    expect(
      getMediaPublicPath({
        entityTable: 'talks',
        slug: 'sample-sermon-on-romans-8',
        speakerSlug: 'john-doe',
      })
    ).toBe('/talks/john-doe/sample-sermon-on-romans-8');
    expect(
      getMediaPublicPath({
        entityTable: 'clips',
        slug: 'sample-clip-romans-8',
      })
    ).toBe('/clips/sample-clip-romans-8');
  });

  it('returns null for a talk without a speaker slug', () => {
    expect(
      getMediaPublicPath({
        entityTable: 'talks',
        slug: 'orphan-talk',
      })
    ).toBe(null);
  });
});

describe('appendMediaHealthItem', () => {
  it('includes newly broken media as new', () => {
    const item = firstAppendedItem(firstTalkInput, {
      persistStatus: 'private',
      previousStatus: 'ok',
    });

    expect(item.adminPath).toBe('/talks/edit/talk1?status=archived');
    expect(item.isNew).toBe(true);
    expect(item.newStatus).toBe('private');
    expect(item.publicPath).toBe('/talks/john-doe/first-talk');
  });

  it('includes still-broken media as not new', () => {
    const item = firstAppendedItem(stillBrokenClipInput, {
      persistStatus: 'missing',
      previousStatus: 'missing',
    });

    expect(item.adminPath).toBe('/clips/edit/clip1?status=archived');
    expect(item.isNew).toBe(false);
    expect(item.publicPath).toBe('/clips/second-clip');
  });

  it('includes a first broken check as not new', () => {
    const item = firstAppendedItem(firstPrivateTalkInput, {
      persistStatus: 'private',
      previousStatus: null,
    });

    expect(item.isNew).toBe(false);
    expect(item.publicPath).toBe('/talks/mary-smith/new-talk');
  });

  it('omits ok media', () => {
    expect(
      appendMediaHealthItem(
        healthyTalkInput,
        {
          persistStatus: 'ok',
          previousStatus: 'ok',
        },
        []
      )
    ).toEqual([]);
  });
});
