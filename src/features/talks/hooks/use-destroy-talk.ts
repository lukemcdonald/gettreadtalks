'use client';

import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useDestroyTalk() {
  const router = useRouter();

  return useMutation(api.talks.destroyTalk, {
    onSuccess: () => {
      router.push('/talks');
    },
  });
}
