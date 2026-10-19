import { afterEach, describe, expect, it } from 'vitest';

import {
  getSiteUrl,
  isLiveSiteUrl,
  isLocalhostUrl,
  isProductionDeployment,
  shouldSendEmail,
} from './siteUrl';

const ORIGINAL_CLOUD_URL = process.env.CONVEX_CLOUD_URL;
const ORIGINAL_SEND_OFF_PROD = process.env.SEND_EMAILS_OFF_PROD;
const ORIGINAL_SITE_URL = process.env.SITE_URL;

afterEach(() => {
  restoreCloudUrl(ORIGINAL_CLOUD_URL);
  restoreSendOffProd(ORIGINAL_SEND_OFF_PROD);
  restoreSiteUrl(ORIGINAL_SITE_URL);
});

function restoreCloudUrl(value: string | undefined) {
  if (value === undefined) {
    delete process.env.CONVEX_CLOUD_URL;
    return;
  }

  process.env.CONVEX_CLOUD_URL = value;
}

function restoreSendOffProd(value: string | undefined) {
  if (value === undefined) {
    delete process.env.SEND_EMAILS_OFF_PROD;
    return;
  }

  process.env.SEND_EMAILS_OFF_PROD = value;
}

function restoreSiteUrl(value: string | undefined) {
  if (value === undefined) {
    delete process.env.SITE_URL;
    return;
  }

  process.env.SITE_URL = value;
}

describe('isLocalhostUrl', () => {
  it('accepts localhost and loopback hosts', () => {
    expect(isLocalhostUrl('https://localhost:3000')).toBe(true);
    expect(isLocalhostUrl('http://127.0.0.1')).toBe(true);
  });

  it('rejects public hosts and invalid urls', () => {
    expect(isLocalhostUrl('https://www.gettreadtalks.com')).toBe(false);
    expect(isLocalhostUrl('not a url')).toBe(false);
  });
});

describe('isLiveSiteUrl', () => {
  it('matches the public site hosts only', () => {
    expect(isLiveSiteUrl('https://www.gettreadtalks.com')).toBe(true);
    expect(isLiveSiteUrl('https://gettreadtalks.com/talks')).toBe(true);
    expect(isLiveSiteUrl('https://preview.vercel.app')).toBe(false);
  });
});

describe('isProductionDeployment', () => {
  it('is false without a cloud url', () => {
    delete process.env.CONVEX_CLOUD_URL;
    delete process.env.SITE_URL;

    expect(isProductionDeployment()).toBe(false);
  });

  it('is false on a local convex backend', () => {
    process.env.CONVEX_CLOUD_URL = 'http://127.0.0.1:3210';
    delete process.env.SITE_URL;

    expect(isProductionDeployment()).toBe(false);
  });

  it('is false for localhost and preview site urls', () => {
    process.env.CONVEX_CLOUD_URL = 'https://dev.convex.cloud';
    process.env.SITE_URL = 'https://localhost:3000';

    expect(isProductionDeployment()).toBe(false);

    process.env.SITE_URL = 'https://branch-abc.vercel.app';

    expect(isProductionDeployment()).toBe(false);
  });

  it('is true when SITE_URL is missing on a cloud deployment', () => {
    process.env.CONVEX_CLOUD_URL = 'https://prod.convex.cloud';
    delete process.env.SITE_URL;

    expect(isProductionDeployment()).toBe(true);
  });

  it('is true for the public site on a cloud deployment', () => {
    process.env.CONVEX_CLOUD_URL = 'https://prod.convex.cloud';
    process.env.SITE_URL = 'https://www.gettreadtalks.com';

    expect(isProductionDeployment()).toBe(true);
  });
});

describe('getSiteUrl', () => {
  it('returns a non-localhost SITE_URL', () => {
    process.env.SITE_URL = 'https://www.gettreadtalks.com/';

    expect(getSiteUrl()).toBe('https://www.gettreadtalks.com');
  });

  it('falls back to localhost off production', () => {
    delete process.env.CONVEX_CLOUD_URL;
    process.env.SITE_URL = 'https://localhost:3000';

    expect(getSiteUrl()).toBe('https://localhost:3000');

    delete process.env.SITE_URL;

    expect(getSiteUrl()).toBe('https://localhost:3000');
  });

  it('throws on production when SITE_URL is missing', () => {
    process.env.CONVEX_CLOUD_URL = 'https://prod.convex.cloud';
    delete process.env.SITE_URL;

    expect(() => getSiteUrl()).toThrow(/public site URL/u);
  });
});

describe('shouldSendEmail', () => {
  it('sends only when SITE_URL is the public site', () => {
    process.env.CONVEX_CLOUD_URL = 'https://prod.convex.cloud';
    process.env.SITE_URL = 'https://www.gettreadtalks.com';
    delete process.env.SEND_EMAILS_OFF_PROD;

    expect(shouldSendEmail()).toBe(true);

    process.env.SITE_URL = 'https://localhost:3000';

    expect(shouldSendEmail()).toBe(false);
  });

  it('can be enabled off production', () => {
    delete process.env.CONVEX_CLOUD_URL;
    process.env.SITE_URL = 'https://localhost:3000';
    process.env.SEND_EMAILS_OFF_PROD = 'true';

    expect(shouldSendEmail()).toBe(true);
  });
});
