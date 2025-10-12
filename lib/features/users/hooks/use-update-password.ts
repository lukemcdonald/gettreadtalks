'use client';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useUpdatePassword() {
  return useMutation(api.users.updatePassword);
}
