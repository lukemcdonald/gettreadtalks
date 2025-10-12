'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useUpdateTalkStatus() {
  return useMutation(api.talks.updateStatus);
}
