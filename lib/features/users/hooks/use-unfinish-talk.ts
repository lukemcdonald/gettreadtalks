'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useUnfinishTalk() {
  return useMutation(api.users.unfinishTalk);
}
