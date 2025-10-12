'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useRemoveFavoriteSpeaker() {
  return useMutation(api.users.removeFavoriteSpeaker);
}
