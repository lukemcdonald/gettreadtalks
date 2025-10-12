'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useRemoveFavoriteClip() {
  return useMutation(api.users.removeFavoriteClip);
}
