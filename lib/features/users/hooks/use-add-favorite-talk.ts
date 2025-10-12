'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useAddFavoriteTalk() {
  return useMutation(api.users.addFavoriteTalk);
}
