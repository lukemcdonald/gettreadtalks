'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useFavoriteSpeaker() {
  return useMutation(api.users.favoriteSpeaker);
}
