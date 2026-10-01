/** Query keys stripped from analytics page context (secrets / PII). */
const SENSITIVE_PARAMS = new Set([
  'api_key',
  'apikey',
  'email',
  'password',
  'token',
]);

function isSensitiveParam(key: string) {
  const normalized = key.toLowerCase();

  if (SENSITIVE_PARAMS.has(normalized)) {
    return true;
  }

  return (
    normalized.endsWith('_password') ||
    normalized.endsWith('_secret') ||
    normalized.endsWith('_token')
  );
}

function sanitizeSearch(search: string) {
  const params = new URLSearchParams();

  for (const [key, value] of new URLSearchParams(search)) {
    if (isSensitiveParam(key)) {
      continue;
    }

    params.append(key, value);
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
    url.search = sanitizeSearch(url.search);
    url.username = '';

    return url.href;
  } catch {
    return '';
  }
}

const PAGE_PROPERTY_FILTERS = {
  path: (value: string) => value.split(/[?#]/u).shift(),
  referrer: sanitizeUrl,
  search: sanitizeSearch,
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
    search: sanitizeSearch(window.location.search),
    title: document.title,
    url: sanitizeUrl(window.location.href),
  };
}
