'use client';

import type { UseMutationOptions } from '@/hooks/use-mutation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useDestroyClip(options?: UseMutationOptions) {
  return useMutation(api.clips.destroyClip, options);
}
