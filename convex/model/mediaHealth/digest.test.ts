import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getClipUrl } from '../../../src/features/clips/utils.ts';
import { getTalkUrl } from '../../../src/features/talks/utils.ts';
import { getMediaAdminEditPath } from '../../../src/lib/entities/paths.ts';
import {
  appendMediaHealthItem,
  buildMediaHealthDigest,
  getMediaPublicPath,
} from './digest.ts';

const firstTalk = {
  adminPath: getMediaAdminEditPath('talks', 'talk1'),
  entityTable: 'talks' as const,
  isNew: true,
  mediaUrl: 'https://www.youtube.com/watch?v=abc',
  newStatus: 'private' as const,
  previousStatus: 'ok' as const,
  publicPath: getTalkUrl('john-doe', 'first-talk'),
  title: 'First Talk',
};

const stillBrokenClip = {
  adminPath: getMediaAdminEditPath('clips', 'clip1'),
  entityTable: 'clips' as const,
  isNew: false,
  mediaUrl: 'https://vimeo.com/1',
  newStatus: 'missing' as const,
  previousStatus: 'missing' as const,
  publicPath: getClipUrl('second-clip'),
  title: 'Second Clip',
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

test('a digest includes newly broken and still-broken items', () => {
  const digest = buildMediaHealthDigest([firstTalk, stillBrokenClip]);

  assert.ok(digest);
  assert.equal(digest.length, 2);
  assert.equal(digest.find((item) => item.title === 'First Talk')?.isNew, true);
  assert.equal(
    digest.find((item) => item.title === 'Second Clip')?.isNew,
    false
  );
});

test('an empty item list does not produce a digest', () => {
  assert.equal(buildMediaHealthDigest([]), null);
});

test('admin paths open the edit sheet with archived prefilled', () => {
  assert.equal(
    getMediaAdminEditPath('talks', 'talk123'),
    '/talks/edit/talk123?status=archived'
  );
  assert.equal(
    getMediaAdminEditPath('clips', 'clip123'),
    '/clips/edit/clip123?status=archived'
  );
});

test('public paths use talk and clip page helpers', () => {
  assert.equal(
    getMediaPublicPath({
      entityTable: 'talks',
      slug: 'sample-sermon-on-romans-8',
      speakerSlug: 'john-doe',
    }),
    getTalkUrl('john-doe', 'sample-sermon-on-romans-8')
  );
  assert.equal(
    getMediaPublicPath({
      entityTable: 'clips',
      slug: 'sample-clip-romans-8',
    }),
    getClipUrl('sample-clip-romans-8')
  );
});

test('a talk without a speaker slug has no public path', () => {
  assert.equal(
    getMediaPublicPath({
      entityTable: 'talks',
      slug: 'orphan-talk',
    }),
    null
  );
});

test('ok to private is included and marked new with a public path', () => {
  const items = appendMediaHealthItem(
    firstTalkInput,
    {
      persistStatus: 'private',
      previousStatus: 'ok',
    },
    []
  );
  const [item] = items;

  assert.equal(items.length, 1);
  assert.ok(item);
  assert.equal(item.adminPath, getMediaAdminEditPath('talks', 'talk1'));
  assert.equal(item.isNew, true);
  assert.equal(item.newStatus, 'private');
  assert.equal(item.publicPath, getTalkUrl('john-doe', 'first-talk'));
});

test('still-missing media is included and not marked new', () => {
  const items = appendMediaHealthItem(
    stillBrokenClipInput,
    {
      persistStatus: 'missing',
      previousStatus: 'missing',
    },
    []
  );
  const [item] = items;

  assert.equal(items.length, 1);
  assert.ok(item);
  assert.equal(item.adminPath, getMediaAdminEditPath('clips', 'clip1'));
  assert.equal(item.isNew, false);
  assert.equal(item.publicPath, getClipUrl('second-clip'));
});

test('a first private check is included and marked new', () => {
  const items = appendMediaHealthItem(
    firstPrivateTalkInput,
    {
      persistStatus: 'private',
      previousStatus: null,
    },
    []
  );
  const [item] = items;

  assert.equal(items.length, 1);
  assert.ok(item);
  assert.equal(item.isNew, true);
  assert.equal(item.publicPath, getTalkUrl('mary-smith', 'new-talk'));
});

test('ok media is omitted from the digest', () => {
  const items = appendMediaHealthItem(
    healthyTalkInput,
    {
      persistStatus: 'ok',
      previousStatus: 'ok',
    },
    []
  );

  assert.equal(items.length, 0);
});
