'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useUnfavoriteSpeaker() {
  return useMutation(api.users.unfavoriteSpeaker);
}
