import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getMediaAdminEditPath } from '../../../src/lib/entities/paths.ts';
import {
  appendMediaHealthItem,
  buildMediaHealthDigest,
  getMediaPublicPath,
} from './digest.ts';

const firstTalk = {
  adminPath: '/talks/edit/talk1?status=archived',
  entityTable: 'talks' as const,
  isNew: true,
  mediaUrl: 'https://www.youtube.com/watch?v=abc',
  newStatus: 'private' as const,
  previousStatus: 'ok' as const,
  publicPath: '/talks/john-doe/first-talk',
  title: 'First Talk',
};

const stillBrokenClip = {
  adminPath: '/clips/edit/clip1?status=archived',
  entityTable: 'clips' as const,
  isNew: false,
  mediaUrl: 'https://vimeo.com/1',
  newStatus: 'missing' as const,
  previousStatus: 'missing' as const,
  publicPath: '/clips/second-clip',
  title: 'Second Clip',
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
    {
      entityId: 'talk1',
      entityTable: 'talks',
      mediaUrl: 'https://www.youtube.com/watch?v=abc',
      slug: 'first-talk',
      speakerSlug: 'john-doe',
      title: 'First Talk',
    },
    {
      persistStatus: 'private',
      previousStatus: 'ok',
    },
    []
  );

  assert.equal(items.length, 1);
  assert.equal(items[0]?.isNew, true);
  assert.equal(items[0]?.newStatus, 'private');
  assert.equal(items[0]?.publicPath, '/talks/john-doe/first-talk');
});

test('still-missing media is included and not marked new', () => {
  const items = appendMediaHealthItem(
    {
      entityId: 'clip1',
      entityTable: 'clips',
      mediaUrl: 'https://vimeo.com/1',
      slug: 'second-clip',
      title: 'Second Clip',
    },
    {
      persistStatus: 'missing',
      previousStatus: 'missing',
    },
    []
  );

  assert.equal(items.length, 1);
  assert.equal(items[0]?.isNew, false);
  assert.equal(items[0]?.publicPath, '/clips/second-clip');
});

test('a first private check is included and marked new', () => {
  const items = appendMediaHealthItem(
    {
      entityId: 'talk2',
      entityTable: 'talks',
      mediaUrl: 'https://www.youtube.com/watch?v=def',
      slug: 'new-talk',
      speakerSlug: 'mary-smith',
      title: 'New Talk',
    },
    {
      persistStatus: 'private',
      previousStatus: null,
    },
    []
  );

  assert.equal(items.length, 1);
  assert.equal(items[0]?.isNew, true);
  assert.equal(items[0]?.publicPath, '/talks/mary-smith/new-talk');
});

test('ok media is omitted from the digest', () => {
  const items = appendMediaHealthItem(
    {
      entityId: 'talk3',
      entityTable: 'talks',
      mediaUrl: 'https://www.youtube.com/watch?v=ghi',
      slug: 'healthy-talk',
      speakerSlug: 'john-doe',
      title: 'Healthy Talk',
    },
    {
      persistStatus: 'ok',
      previousStatus: 'ok',
    },
    []
  );

  assert.equal(items.length, 0);
});
