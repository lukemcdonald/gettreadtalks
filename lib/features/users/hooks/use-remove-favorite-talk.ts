'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useRemoveFavoriteTalk() {
  return useMutation(api.users.removeFavoriteTalk);
}
