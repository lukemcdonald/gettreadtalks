import type { StatusFilterType } from '../../lib/types';

export function normalizeSearchQuery(query: string) {
  return query.trim().replaceAll(/\s+/gu, ' ');
}

export function searchPhrases(query: string) {
  const normalized = normalizeSearchQuery(query);

  if (!normalized) {
    return [];
  }

  const phrases = [normalized];

  for (const token of normalized.split(' ')) {
    if (!phrases.includes(token)) {
      phrases.push(token);
    }
  }

  return phrases;
}

export function searchTitleQuery(queryText: string, status?: StatusFilterType) {
  return <
    T extends {
      eq: (field: 'status', value: Exclude<StatusFilterType, 'all'>) => T;
    },
  >(q: {
    search: (field: 'title', value: string) => T;
  }) => {
    const searched = q.search('title', queryText);

    if (status && status !== 'all') {
      return searched.eq('status', status);
    }

    return searched;
  };
}

export function uniqueById<T extends { _id: string }>(items: T[]) {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    if (seen.has(item._id)) {
      continue;
    }

    seen.add(item._id);
    unique.push(item);
  }

  return unique;
}
