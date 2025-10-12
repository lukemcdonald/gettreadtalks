'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useAddFinishedTalk() {
  return useMutation(api.users.addFinishedTalk);
}
