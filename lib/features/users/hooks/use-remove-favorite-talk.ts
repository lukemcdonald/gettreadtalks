'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useRemoveFavoriteTalk() {
  return useMutation(api.users.removeFavoriteTalk);
}
