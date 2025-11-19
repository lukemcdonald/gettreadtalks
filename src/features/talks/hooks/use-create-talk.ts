'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useCreateTalk() {
  return useMutation(api.talks.createTalk);
}
