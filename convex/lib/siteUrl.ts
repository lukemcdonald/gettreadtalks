import { site } from '../../src/configs/site';

const LOOPBACK_HOSTS = new Set(['127.0.0.1', '::1', '[::1]', 'localhost']);

export function getPublicSiteUrl(): string {
  return resolvePublicSiteUrl(process.env.SITE_URL);
}

export function getSiteUrl(): string {
  return trimTrailingSlash(process.env.SITE_URL || site.url);
}

export function isLoopbackSiteUrl(url: string) {
  try {
    return LOOPBACK_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

export function resolvePublicSiteUrl(configured?: string) {
  const canonical = trimTrailingSlash(site.url);

  if (!configured?.trim()) {
    return canonical;
  }

  const normalized = trimTrailingSlash(configured.trim());

  try {
    const parsed = new URL(normalized);

    if (LOOPBACK_HOSTS.has(parsed.hostname)) {
      return canonical;
    }
  } catch {
    return canonical;
  }

  return normalized;
}

function trimTrailingSlash(url: string) {
  return url.replace(/\/$/u, '');
}
