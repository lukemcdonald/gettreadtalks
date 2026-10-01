/** `/reset-password` puts the reset secret in `?token=`. Do not send that to Segment. */
function stripResetToken(search: string) {
  const params = new URLSearchParams(search);

  const keysToDelete: string[] = [];

  for (const key of params.keys()) {
    if (key.toLowerCase() === 'token') {
      keysToDelete.push(key);
    }
  }

  for (const key of keysToDelete) {
    params.delete(key);
  }

  const result = params.toString();

  return result ? `?${result}` : '';
}

function sanitizeUrl(value: string) {
  try {
    const url = new URL(value);

    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }

    url.hash = '';
    url.password = '';
    url.search = stripResetToken(url.search);
    url.username = '';

    return url.href;
  } catch {
    return '';
  }
}

const PAGE_PROPERTY_FILTERS = {
  path: (value: string) => value.split(/[?#]/u).shift(),
  referrer: sanitizeUrl,
  search: stripResetToken,
  url: sanitizeUrl,
};

export function sanitizePageProperties(properties: Record<string, unknown>) {
  const sanitized = { ...properties };

  for (const [key, filter] of Object.entries(PAGE_PROPERTY_FILTERS)) {
    const value = sanitized[key];

    if (typeof value === 'string') {
      sanitized[key] = filter(value);
    }
  }

  return sanitized;
}

export function getPageContext() {
  return {
    path: window.location.pathname,
    referrer: sanitizeUrl(document.referrer),
    search: stripResetToken(window.location.search),
    title: document.title,
    url: sanitizeUrl(window.location.href),
  };
}
