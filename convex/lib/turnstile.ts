const PREVIEW_HOST_SUFFIX = '.vercel.app';

/** Cloudflare Turnstile cannot allowlist `*.vercel.app`. */
function isPreviewHost(hostname: string) {
  return hostname.endsWith(PREVIEW_HOST_SUFFIX);
}

export function isPreviewSiteUrl(siteUrl: string) {
  try {
    return isPreviewHost(new URL(siteUrl).hostname);
  } catch {
    return false;
  }
}
