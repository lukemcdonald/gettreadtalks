'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useUpdateTalk() {
  return useMutation(api.talks.update);
}
