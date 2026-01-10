'use client';

import type { UseMutationOptions } from '@/hooks/use-mutation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useDestroyTalk(options?: UseMutationOptions) {
  return useMutation(api.talks.destroyTalk, options);
}
