'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useAddFinishedTalk() {
  return useMutation(api.users.addFinishedTalk);
}
