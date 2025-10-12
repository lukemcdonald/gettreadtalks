'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useUpdatePassword() {
  return useMutation(api.users.updatePassword);
}
