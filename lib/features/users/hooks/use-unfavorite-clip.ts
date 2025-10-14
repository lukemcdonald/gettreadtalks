'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useUnfavoriteClip() {
  return useMutation(api.users.unfavoriteClip);
}
