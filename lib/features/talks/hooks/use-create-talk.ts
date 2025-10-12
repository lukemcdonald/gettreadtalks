'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useCreateTalk() {
  return useMutation(api.talks.create);
}
