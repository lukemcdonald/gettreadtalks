'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useRemoveFinishedTalk() {
  return useMutation(api.users.removeFinishedTalk);
}
