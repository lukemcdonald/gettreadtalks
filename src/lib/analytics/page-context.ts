const ATTRIBUTION_PARAMS = new Set([
  'utm_campaign',
  'utm_content',
  'utm_medium',
  'utm_source',
  'utm_term',
]);

function sanitizeSearch(search: string) {
  const params = new URLSearchParams();
  for (const [key, value] of new URLSearchParams(search)) {
    if (ATTRIBUTION_PARAMS.has(key)) {
      params.append(key, value);
    }
  }
  const result = params.toString();
  return result ? `?${result}` : '';
}

function sanitizeUrl(value: string) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) {
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
  const url = new URL(sanitizeUrl(window.location.href));
  return {
    path: url.pathname,
    referrer: sanitizeUrl(document.referrer),
    search: url.search,
    title: document.title,
    url: url.href,
  };
}
