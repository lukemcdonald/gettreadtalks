import { afterEach, describe, expect, it } from 'vitest';

import { site } from '../../src/configs/site';
import {
  getPublicSiteUrl,
  getSiteUrl,
  isLoopbackSiteUrl,
  resolvePublicSiteUrl,
} from './siteUrl';

const CANONICAL = site.url;
const PREVIEW = 'https://gettreadtalks-git-fix.vercel.app';

describe('isLoopbackSiteUrl', () => {
  it('detects loopback hosts', () => {
    expect(isLoopbackSiteUrl('https://localhost:3000')).toBe(true);
    expect(isLoopbackSiteUrl('http://127.0.0.1')).toBe(true);
  });

  it('rejects public hosts and invalid URLs', () => {
    expect(isLoopbackSiteUrl(CANONICAL)).toBe(false);
    expect(isLoopbackSiteUrl('not a url')).toBe(false);
  });
});

describe('resolvePublicSiteUrl', () => {
  it('uses the canonical site URL when env is missing', () => {
    expect(resolvePublicSiteUrl()).toBe(CANONICAL);
    expect(resolvePublicSiteUrl('')).toBe(CANONICAL);
    expect(resolvePublicSiteUrl('   ')).toBe(CANONICAL);
  });

  it('ignores loopback SITE_URL values', () => {
    expect(resolvePublicSiteUrl('https://localhost:3000')).toBe(CANONICAL);
    expect(resolvePublicSiteUrl('http://127.0.0.1:3000/')).toBe(CANONICAL);
  });

  it('keeps a non-loopback SITE_URL and strips a trailing slash', () => {
    expect(resolvePublicSiteUrl(`${PREVIEW}/`)).toBe(PREVIEW);
    expect(resolvePublicSiteUrl(CANONICAL)).toBe(CANONICAL);
  });

  it('uses the canonical site URL for invalid values', () => {
    expect(resolvePublicSiteUrl('not a url')).toBe(CANONICAL);
  });
});

describe('site URL env helpers', () => {
  const previous = process.env.SITE_URL;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.SITE_URL;
    } else {
      process.env.SITE_URL = previous;
    }
  });

  it('does not let localhost SITE_URL win for public links', () => {
    process.env.SITE_URL = 'https://localhost:3000';

    expect(getPublicSiteUrl()).toBe(CANONICAL);
  });

  it('still honors localhost SITE_URL for auth', () => {
    process.env.SITE_URL = 'https://localhost:3000';

    expect(getSiteUrl()).toBe('https://localhost:3000');
  });
});
