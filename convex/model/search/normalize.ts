export function normalizeSearchQuery(query: string) {
  return query.trim().replaceAll(/\s+/gu, ' ');
}
