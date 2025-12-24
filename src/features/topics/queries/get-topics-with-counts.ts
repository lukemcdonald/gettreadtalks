'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTopicsWithCounts() {
  const token = await getAuthToken();
  return await fetchQuery(api.topics.listTopicsWithCount, {}, { token });
}
