import { describe, expect, it } from 'vitest';

import { site } from '../../src/configs/site';
import { resolvePublicSiteUrl } from './siteUrl';

const CANONICAL = site.url;

describe('resolvePublicSiteUrl', () => {
  it('ignores loopback and invalid SITE_URL values', () => {
    expect(resolvePublicSiteUrl('https://localhost:3000')).toBe(CANONICAL);
    expect(resolvePublicSiteUrl('http://127.0.0.1:3000/')).toBe(CANONICAL);
    expect(resolvePublicSiteUrl('not a url')).toBe(CANONICAL);
    expect(resolvePublicSiteUrl()).toBe(CANONICAL);
  });
});
