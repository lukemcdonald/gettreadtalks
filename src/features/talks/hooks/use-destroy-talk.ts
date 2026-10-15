'use client';

import type { UseMutationOptions } from '@/hooks/use-mutation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks/use-mutation';

export function useDestroyTalk(options?: UseMutationOptions) {
  return useMutation(api.talks.destroyTalk, options);
}
