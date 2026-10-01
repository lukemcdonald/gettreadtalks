const IGNORED_PARAMS = new Set(['cursor', 'prevcursor', 'token']);
const SEARCH_PARAM = 'search';

function parseParams(search: string) {
  const query = search.startsWith('?') ? search.slice(1) : search;
  const parsed = new URLSearchParams(query);
  const params = new Map<string, string>();

  for (const [key, value] of parsed) {
    params.set(key, value);
  }

  return params;
}

function isIgnoredParam(key: string) {
  return IGNORED_PARAMS.has(key.toLowerCase());
}

function paramValue(params: Map<string, string>, key: string) {
  return params.get(key) ?? '';
}

function collectKeys(next: Map<string, string>, previous: Map<string, string>) {
  const keys = new Set<string>();

  for (const key of next.keys()) {
    keys.add(key);
  }

  for (const key of previous.keys()) {
    keys.add(key);
  }

  return keys;
}

function shouldTrackParam(
  key: string,
  previous: Map<string, string>,
  next: Map<string, string>
) {
  if (isIgnoredParam(key)) {
    return false;
  }

  return paramValue(previous, key) !== paramValue(next, key);
}

function changedEntries(previousSearch: string, nextSearch: string) {
  const next = parseParams(nextSearch);
  const previous = parseParams(previousSearch);
  const entries: { key: string; value: string }[] = [];

  for (const key of collectKeys(next, previous)) {
    if (!shouldTrackParam(key, previous, next)) {
      continue;
    }

    entries.push({ key, value: paramValue(next, key) });
  }

  return entries;
}

export function getQueryChange(previousSearch: string, nextSearch: string) {
  const filters: { filter: string; value: string }[] = [];
  let query: string | undefined;

  for (const { key, value } of changedEntries(previousSearch, nextSearch)) {
    if (key === SEARCH_PARAM) {
      query = value;
      continue;
    }

    filters.push({ filter: key, value });
  }

  filters.sort((left, right) => left.filter.localeCompare(right.filter));

  return { filters, query };
}
