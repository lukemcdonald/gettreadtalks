import type { Clip } from '@/features/clips/types';

export function buildClipPath(clip: Pick<Clip, 'slug'>) {
  return `/clips/${clip.slug}`;
}

export function buildClipsPath() {
  return '/clips';
}
