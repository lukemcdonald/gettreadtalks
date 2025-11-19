'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useUnfavoriteTalk() {
  return useMutation(api.users.unfavoriteTalk);
}
