import { describe, expect, test } from 'vitest';

import { sanitizePageProperties } from './page-context';

describe('sanitizePageProperties', () => {
  test('strips reset-password token and keeps other params', () => {
    const result = sanitizePageProperties({
      search: '?TOKEN=abc&search=bible&email=a@b.c',
    });

    expect(result.search).toBe('?search=bible&email=a%40b.c');
  });

  test('keeps product search params', () => {
    const result = sanitizePageProperties({
      search: '?search=bible&sort=recent&speakers=jonny',
    });

    expect(result.search).toBe('?search=bible&sort=recent&speakers=jonny');
  });

  test('drops url credentials, hash, and token', () => {
    const result = sanitizePageProperties({
      url: 'https://user:pass@example.com/reset-password?token=abc#hash',
    });

    expect(result.url).toBe('https://example.com/reset-password');
  });

  test('strips query and hash from path', () => {
    const result = sanitizePageProperties({
      path: '/talks?search=bible#top',
    });

    expect(result.path).toBe('/talks');
  });

  test('drops non-http urls', () => {
    const result = sanitizePageProperties({
      referrer: 'data:text/plain,hi',
      url: 'ftp://example.com/talks',
    });

    expect(result.referrer).toBe('');
    expect(result.url).toBe('');
  });
});
