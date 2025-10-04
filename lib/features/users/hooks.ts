'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

export function useCurrentUser() {
  return useQuery(api.auth.getCurrentUser);
}
