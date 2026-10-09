import assert from 'node:assert/strict';
import { register } from 'node:module';
import { test } from 'node:test';

register(new URL('../../scripts/node-test-hooks.mjs', import.meta.url));

const { getPublishedAtForStatus, paginateArray, slugify } =
  await import('./utils.ts');

test('returns empty for missing text', () => {
  assert.equal(slugify(null), '');
  assert.equal(slugify(''), '');
});

test('slugifies a title', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('strips punctuation and extra separators', () => {
  assert.equal(
    slugify('  The Cross: A Study -- Part 1  '),
    'the-cross-a-study-part-1'
  );
});

test('sets publishedAt when publishing without an existing timestamp', () => {
  const before = Date.now();
  const publishedAt = getPublishedAtForStatus('published');

  assert.ok(
    publishedAt !== undefined &&
      publishedAt >= before &&
      publishedAt <= Date.now()
  );
});

test('keeps the existing publishedAt when already published', () => {
  assert.equal(
    getPublishedAtForStatus('published', 1_700_000_000_000),
    1_700_000_000_000
  );
});

test('clears publishedAt for a non-published status', () => {
  assert.equal(
    getPublishedAtForStatus('archived', 1_700_000_000_000),
    undefined
  );
});

test('returns the first page and a continuation cursor', () => {
  assert.deepEqual(paginateArray(['a', 'b', 'c'], null, 2), {
    continueCursor: '2',
    isDone: false,
    page: ['a', 'b'],
  });
});

test('returns the last page and marks done', () => {
  assert.deepEqual(paginateArray(['a', 'b', 'c'], '2', 2), {
    continueCursor: '',
    isDone: true,
    page: ['c'],
  });
});

test('marks done when the page includes every remaining item', () => {
  assert.deepEqual(paginateArray(['a', 'b'], null, 2), {
    continueCursor: '',
    isDone: true,
    page: ['a', 'b'],
  });
});
