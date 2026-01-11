'use client';

import type { UseMutationOptions } from '@/hooks/use-mutation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

// TODO: Should this return a primary archive action to avoid have to call archiveTalk.mutate or archiveTalk.mutateAsync? Same with other use-talk-* mutation hooks.
export function useArchiveTalk(options?: UseMutationOptions) {
  return useMutation(api.talks.archiveTalk, options);
}
