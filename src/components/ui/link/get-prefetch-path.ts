export function getPrefetchPath(href: string | { pathname?: string | null }) {
  const path = typeof href === 'string' ? href : (href.pathname ?? '');

  if (!path.startsWith('/') || path.startsWith('//')) {
    return '';
  }

  return path;
}
