'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useCurrentUser() {
  const data = useQuery(api.auth.getCurrentUser);

  return {
    data,
    isLoading: data === undefined,
  };
}
