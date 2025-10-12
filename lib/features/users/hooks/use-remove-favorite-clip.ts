'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useRemoveFavoriteClip() {
  return useMutation(api.users.removeFavoriteClip);
}
