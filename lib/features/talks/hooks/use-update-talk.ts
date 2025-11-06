'use client';

import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useUpdateTalk() {
  const router = useRouter();

  return useMutation(api.talks.updateTalk, {
    onSuccess: () => {
      // Redirect will be handled by the form component
    },
  });
}
