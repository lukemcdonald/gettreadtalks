import assert from 'node:assert/strict';
import { test } from 'node:test';

import { sanitizePageProperties } from './page-context.ts';

test('strips reset-password token and keeps other params', () => {
  const result = sanitizePageProperties({
    search: '?TOKEN=abc&search=bible&email=a@b.c',
  });

  assert.equal(result.search, '?search=bible&email=a%40b.c');
});

test('keeps product search params', () => {
  const result = sanitizePageProperties({
    search: '?search=bible&sort=recent&speakers=jonny',
  });

  assert.equal(result.search, '?search=bible&sort=recent&speakers=jonny');
});

test('drops url credentials, hash, and token', () => {
  const result = sanitizePageProperties({
    url: 'https://user:pass@example.com/reset-password?token=abc#hash',
  });

  assert.equal(result.url, 'https://example.com/reset-password');
});

test('strips query and hash from path', () => {
  const result = sanitizePageProperties({
    path: '/talks?search=bible#top',
  });

  assert.equal(result.path, '/talks');
});

test('drops non-http urls', () => {
  const result = sanitizePageProperties({
    referrer: 'data:text/plain,hi',
    url: 'ftp://example.com/talks',
  });

  assert.equal(result.referrer, '');
  assert.equal(result.url, '');
});
