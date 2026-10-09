'use client';

import type { UseMutationOptions } from '@/hooks/use-mutation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useUnfavoriteClip(options?: UseMutationOptions) {
  return useMutation(api.users.unfavoriteClip, options);
}
