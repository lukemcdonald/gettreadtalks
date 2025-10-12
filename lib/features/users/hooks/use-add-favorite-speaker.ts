'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useAddFavoriteSpeaker() {
  return useMutation(api.users.addFavoriteSpeaker);
}
