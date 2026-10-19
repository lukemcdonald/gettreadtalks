import { site } from '../../configs/site';

export const ACCOUNT_PATH = '/account';
export const MANAGE_PATH = '/manage';
export const MEDIA_HEALTH_PATH = '/manage/media';

export const ADMIN_LIST_PATHS = {
  clips: '/manage/clips',
  collections: '/manage/collections',
  speakers: '/manage/speakers',
  talks: '/manage/talks',
  topics: '/manage/topics',
} as const;

export type AdminEntity = keyof typeof ADMIN_LIST_PATHS;

type PathQueryValue = boolean | number | string;

export function buildAbsoluteUrl(path: string, origin = site.url) {
  const base = origin.replace(/\/$/u, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalized}`;
}

export function buildAdminListPath(entity: AdminEntity) {
  return ADMIN_LIST_PATHS[entity];
}

export function getLoginRedirect(path: string) {
  return `/login?redirect=${encodeURIComponent(path)}`;
}

export function buildPathQuery(
  query?: Record<string, PathQueryValue | undefined>
) {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  for (const key of Object.keys(query).toSorted()) {
    const value = query[key];

    if (value === undefined) {
      continue;
    }

    params.set(key, String(value));
  }

  const serialized = params.toString();

  if (!serialized) {
    return '';
  }

  return `?${serialized}`;
}

export function buildEntityEditPath(
  entity: AdminEntity,
  id: string,
  query?: { status?: 'archived' }
) {
  return `/${entity}/edit/${id}${buildPathQuery(query)}`;
}

export function buildEntityNewPath(entity: AdminEntity) {
  return `/${entity}/new`;
}

export function buildPublicEditPath(publicPath: string) {
  return `${publicPath}/edit`;
}

export function buildMediaHealthPath() {
  return MEDIA_HEALTH_PATH;
}
