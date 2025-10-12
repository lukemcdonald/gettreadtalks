'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useRemoveFavoriteSpeaker() {
  return useMutation(api.users.removeFavoriteSpeaker);
}
