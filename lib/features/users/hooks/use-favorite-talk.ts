'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useFavoriteTalk() {
  return useMutation(api.users.favoriteTalk);
}
