'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

export function useUserFavorites(limit?: number) {
  return useQuery(api.favorites.getUserFavorites, { limit });
}
