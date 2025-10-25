/**
 * Centralized route definitions for type-safe navigation across the application.
 *
 * @example
 * import { routes } from '@/lib/routes';
 * router.push(routes.talks.list);
 * router.push(routes.talks.detail('my-slug'));
 */

export const routes = {
  // Public routes
  home: '/',
  about: '/about',
  beliefs: '/summary-of-essential-beliefs',

  // Auth routes
  login: '/login',

  // Account routes (authenticated)
  account: {
    root: '/account',
    favorites: '/account/favorites',
    finished: '/account/finished',
  },

  // Clips
  clips: {
    list: '/clips',
    detail: (slug: string) => `/clips/${slug}`,
  },

  // Collections
  collections: {
    list: '/collections',
    detail: (slug: string) => `/collections/${slug}`,
  },

  // Speakers
  speakers: {
    list: '/speakers',
    detail: (slug: string) => `/speakers/${slug}`,
  },

  // Talks
  talks: {
    list: '/talks',
    detail: (slug: string) => `/talks/${slug}`,
  },

  // Topics
  topics: {
    list: '/topics',
    detail: (slug: string) => `/topics/${slug}`,
  },
} as const;

export type Routes = typeof routes;
