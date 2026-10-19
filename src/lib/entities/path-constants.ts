export const MEDIA_HEALTH_PATH = '/manage/media';

export function joinOriginAndPath(path: string, origin: string) {
  const base = origin.replace(/\/$/u, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalized}`;
}
