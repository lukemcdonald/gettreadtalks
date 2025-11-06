'use client';

import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/lib/hooks';

export function useCreateTalk() {
  const router = useRouter();

  return useMutation(api.talks.createTalk, {
    onSuccess: (talkId) => {
      // Redirect will be handled by the form component after getting the slug
      // For now, we'll need to fetch the talk to get the slug
      // This could be improved by returning the slug from the mutation
    },
  });
}
