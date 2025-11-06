'use client';

import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useArchiveTalk() {
  const router = useRouter();

  return useMutation(api.talks.archiveTalk, {
    onSuccess: () => {
      router.push('/talks');
    },
  });
}
