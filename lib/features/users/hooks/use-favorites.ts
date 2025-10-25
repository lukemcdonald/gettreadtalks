'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useFavorites(limit?: number) {
  const data = useQuery(api.users.listUserFavorites, { limit });

  return {
    data: data,
    isLoading: data === undefined,
  };
}
