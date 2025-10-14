'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useFinishTalk() {
  return useMutation(api.users.finishTalk);
}
