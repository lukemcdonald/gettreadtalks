'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useCurrentUser() {
  const data = useQuery(api.users.getUser);

  return {
    data,
    isLoading: data === undefined,
  };
}
