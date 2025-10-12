'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useAddFavoriteSpeaker() {
  return useMutation(api.users.addFavoriteSpeaker);
}
