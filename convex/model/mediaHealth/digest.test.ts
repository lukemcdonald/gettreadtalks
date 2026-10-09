import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  appendMediaHealthItem,
  buildMediaHealthDigest,
  getMediaPublicPath,
} from './digest.ts';

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

  assert.equal(items.length, 1);
  assert.ok(item);

  return item;
}

describe('buildMediaHealthDigest', () => {
  test('returns the items when any exist', () => {
    const items = [digestItem];

    assert.deepEqual(buildMediaHealthDigest(items), items);
  });

  test('returns null when empty', () => {
    assert.equal(buildMediaHealthDigest([]), null);
  });
});

describe('getMediaPublicPath', () => {
  test('builds talk and clip page paths', () => {
    assert.equal(
      getMediaPublicPath({
        entityTable: 'talks',
        slug: 'sample-sermon-on-romans-8',
        speakerSlug: 'john-doe',
      }),
      '/talks/john-doe/sample-sermon-on-romans-8'
    );
    assert.equal(
      getMediaPublicPath({
        entityTable: 'clips',
        slug: 'sample-clip-romans-8',
      }),
      '/clips/sample-clip-romans-8'
    );
  });

  test('returns null for a talk without a speaker slug', () => {
    assert.equal(
      getMediaPublicPath({
        entityTable: 'talks',
        slug: 'orphan-talk',
      }),
      null
    );
  });
});

describe('appendMediaHealthItem', () => {
  test('includes newly broken media as new', () => {
    const item = firstAppendedItem(firstTalkInput, {
      persistStatus: 'private',
      previousStatus: 'ok',
    });

    assert.equal(item.adminPath, '/talks/edit/talk1?status=archived');
    assert.equal(item.isNew, true);
    assert.equal(item.newStatus, 'private');
    assert.equal(item.publicPath, '/talks/john-doe/first-talk');
  });

  test('includes still-broken media as not new', () => {
    const item = firstAppendedItem(stillBrokenClipInput, {
      persistStatus: 'missing',
      previousStatus: 'missing',
    });

    assert.equal(item.adminPath, '/clips/edit/clip1?status=archived');
    assert.equal(item.isNew, false);
    assert.equal(item.publicPath, '/clips/second-clip');
  });

  test('includes a first broken check as not new', () => {
    const item = firstAppendedItem(firstPrivateTalkInput, {
      persistStatus: 'private',
      previousStatus: null,
    });

    assert.equal(item.isNew, false);
    assert.equal(item.publicPath, '/talks/mary-smith/new-talk');
  });

  test('omits ok media', () => {
    assert.deepEqual(
      appendMediaHealthItem(
        healthyTalkInput,
        {
          persistStatus: 'ok',
          previousStatus: 'ok',
        },
        []
      ),
      []
    );
  });
});
