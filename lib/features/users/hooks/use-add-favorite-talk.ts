'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useAddFavoriteTalk() {
  return useMutation(api.users.addFavoriteTalk);
}
