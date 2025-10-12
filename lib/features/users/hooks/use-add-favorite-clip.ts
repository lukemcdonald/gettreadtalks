'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useAddFavoriteClip() {
  return useMutation(api.users.addFavoriteClip);
}
