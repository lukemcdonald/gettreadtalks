'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useUpdateTalk() {
  return useMutation(api.talks.updateTalk);
}
