'use server';

import type { TalkId } from '../types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTalk(id: TalkId) {
  const token = await getAuthToken();

  return fetchQuery(api.talks.getTalk, { id }, { token });
}
