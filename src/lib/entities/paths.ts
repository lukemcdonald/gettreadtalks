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

export function getManageTitleHref({
  editPath,
  publicPath,
}: {
  editPath: string;
  publicPath?: string;
}) {
  if (publicPath) {
    return publicPath;
  }

  return editPath;
}

export function getPublicEditPath(publicPath: string) {
  return `${publicPath}/edit`;
}
