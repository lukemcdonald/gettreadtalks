'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useFavoriteTalk() {
  return useMutation(api.users.favoriteTalk);
}
