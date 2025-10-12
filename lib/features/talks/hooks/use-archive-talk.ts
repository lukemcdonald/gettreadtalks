'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useArchiveTalk() {
  return useMutation(api.talks.archive);
}
