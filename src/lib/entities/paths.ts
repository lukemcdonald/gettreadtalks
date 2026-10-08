export const ADMIN_LIST_PATHS = {
  clips: '/account/clips',
  collections: '/account/collections',
  speakers: '/account/speakers',
  talks: '/account/talks',
  topics: '/account/topics',
} as const;

export type AdminEntity = keyof typeof ADMIN_LIST_PATHS;

export function getAdminListPath(entity: AdminEntity) {
  return ADMIN_LIST_PATHS[entity];
}

export function getAdminLoginRedirect(path: string) {
  return `/login?redirect=${encodeURIComponent(path)}`;
}

export function getEntityEditPath(
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

export function getEntityNewPath(entity: AdminEntity) {
  return `/${entity}/new`;
}

export function getMediaAdminEditPath(
  entityTable: 'clips' | 'talks',
  entityId: string
) {
  return getEntityEditPath(entityTable, entityId, { status: 'archived' });
}
