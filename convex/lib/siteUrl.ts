import { isPreviewSiteUrl } from './turnstile';

const LOCAL_SITE_URL = 'https://localhost:3000';
const LIVE_HOSTS = new Set(['gettreadtalks.com', 'www.gettreadtalks.com']);

function getHostname(value: string): string | null {
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

export function isLocalhostUrl(value: string): boolean {
  const hostname = getHostname(value);

  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function isLiveSiteUrl(value: string): boolean {
  const hostname = getHostname(value);

  return hostname !== null && LIVE_HOSTS.has(hostname);
}

/**
 * Cloud Convex with a missing SITE_URL is treated as production so localhost
 * links cannot leak. Local backends, previews, and localhost SITE_URL stay
 * non-production.
 */
export function isProductionDeployment(): boolean {
  const cloudUrl = process.env.CONVEX_CLOUD_URL ?? '';

  if (!cloudUrl || isLocalhostUrl(cloudUrl)) {
    return false;
  }

  const siteUrl = process.env.SITE_URL?.trim() ?? '';

  if (!siteUrl) {
    return true;
  }

  if (isLocalhostUrl(siteUrl) || isPreviewSiteUrl(siteUrl)) {
    return false;
  }

  return true;
}

export function getSiteUrl(): string {
  const configured = process.env.SITE_URL?.trim();

  if (configured && !isLocalhostUrl(configured)) {
    return configured.replace(/\/$/u, '');
  }

  if (isProductionDeployment()) {
    throw new Error(
      'SITE_URL must be the public site URL on the production Convex deployment; localhost is not allowed.'
    );
  }

  return LOCAL_SITE_URL;
}

/**
 * Better Auth is constructed during Convex module analysis, when SITE_URL
 * is often unset. Email sending still uses `getSiteUrl()` and can throw.
 */
export function getAuthSiteUrl(): string {
  try {
    return getSiteUrl();
  } catch {
    return LOCAL_SITE_URL;
  }
}

/**
 * Live mail only goes out when SITE_URL is the public site, unless sending
 * off-production is explicitly enabled. Media health and other admin emails
 * share this gate so a dev Convex deployment cannot email real addresses.
 */
export function shouldSendEmail(): boolean {
  if (process.env.SEND_EMAILS_OFF_PROD === 'true') {
    return true;
  }

  try {
    return isLiveSiteUrl(getSiteUrl());
  } catch {
    return false;
  }
}
