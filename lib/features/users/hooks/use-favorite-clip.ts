'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useFavoriteClip() {
  return useMutation(api.users.favoriteClip);
}
