'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

export function useUserFavorites() {
  return useQuery(api.favorites.getUserFavorites);
}
