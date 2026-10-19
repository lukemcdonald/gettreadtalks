export const ACCOUNT_PATH = '/account';
export const MANAGE_PATH = '/manage';

export const ADMIN_LIST_PATHS = {
  clips: '/manage/clips',
  collections: '/manage/collections',
  speakers: '/manage/speakers',
  talks: '/manage/talks',
  topics: '/manage/topics',
} as const;

export type AdminEntity = keyof typeof ADMIN_LIST_PATHS;

export function buildAdminListPath(entity: AdminEntity) {
  return ADMIN_LIST_PATHS[entity];
}

export function getLoginRedirect(path: string) {
  return `/login?redirect=${encodeURIComponent(path)}`;
}

export function buildEntityEditPath(
  entity: AdminEntity,
  id: string,
  query?: { status?: 'archived' }
) {
  const path = `/${entity}/edit/${id}`;

  if (query?.status === 'archived') {
    return `${path}?status=archived`;
  }

  return path;
}

export function buildEntityNewPath(entity: AdminEntity) {
  return `/${entity}/new`;
}

export function buildPublicEditPath(publicPath: string) {
  return `${publicPath}/edit`;
}
