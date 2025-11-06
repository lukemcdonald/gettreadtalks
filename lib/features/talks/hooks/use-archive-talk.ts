'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@/lib/hooks';

import { api } from '@/convex/_generated/api';

export function useArchiveTalk() {
  const router = useRouter();

  return useMutation(api.talks.archiveTalk, {
    onSuccess: () => {
      router.push('/talks');
    },
  });
}
