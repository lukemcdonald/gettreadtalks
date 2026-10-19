import type { Collection } from '@/features/collections/types';

export function buildCollectionPath(collection: Pick<Collection, 'slug'>) {
  return `/collections/${collection.slug}`;
}

export function buildCollectionsPath() {
  return '/collections';
}
