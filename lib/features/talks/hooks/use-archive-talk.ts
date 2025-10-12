'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useArchiveTalk() {
  return useMutation(api.talks.archive);
}
