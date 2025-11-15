'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useUpdateTalk() {
  return useMutation(api.talks.updateTalk);
}
