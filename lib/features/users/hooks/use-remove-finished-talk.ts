'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useRemoveFinishedTalk() {
  return useMutation(api.users.removeFinishedTalk);
}
