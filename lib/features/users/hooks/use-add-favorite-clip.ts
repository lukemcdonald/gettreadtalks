'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useAddFavoriteClip() {
  return useMutation(api.users.addFavoriteClip);
}
