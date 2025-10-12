'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useCurrentUser() {
  return useQuery(api.auth.getCurrentUser);
}

export function useUserFavorites(limit?: number) {
  return useQuery(api.users.listFavorites, { limit });
}
