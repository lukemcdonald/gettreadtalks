'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useUserFavorites(limit?: number) {
  return useQuery(api.users.listFavorites, { limit });
}
