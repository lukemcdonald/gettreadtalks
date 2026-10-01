import assert from 'node:assert/strict';
import { test } from 'node:test';

import { sanitizePageProperties } from './page-context.ts';

test('strips exact sensitive keys case-insensitively', () => {
  const result = sanitizePageProperties({
    search: '?EMAIL=a@b.c&Password=secret&TOKEN=abc&search=bible',
  });

  assert.equal(result.search, '?search=bible');
});

test('strips token-suffixed and common credential aliases', () => {
  const result = sanitizePageProperties({
    search:
      '?access_token=a&refresh_token=b&id_token=c&api_key=d&client_secret=e&user_password=f&search=bible',
  });

  assert.equal(result.search, '?search=bible');
});

test('keeps product and attribution params', () => {
  const result = sanitizePageProperties({
    search: '?search=bible&sort=recent&speakers=jonny&utm_source=google',
  });

  assert.equal(
    result.search,
    '?search=bible&sort=recent&speakers=jonny&utm_source=google'
  );
});

test('sanitizes url search and drops credentials', () => {
  const result = sanitizePageProperties({
    url: 'https://user:pass@example.com/talks?search=bible&token=abc#hash',
  });

  assert.equal(result.url, 'https://example.com/talks?search=bible');
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
