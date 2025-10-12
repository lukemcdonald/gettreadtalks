'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useTalkBySlug(slug: string) {
  const data = useQuery(api.talks.getBySlug, { slug });

  return {
    data,
    isLoading: data === undefined,
    notFound: data === null,
  };
}
