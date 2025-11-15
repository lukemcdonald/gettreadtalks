'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useUnfavoriteTalk() {
  return useMutation(api.users.unfavoriteTalk);
}
