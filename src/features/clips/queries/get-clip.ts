'use server';

import type { ClipId } from '../types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getClip(id: ClipId) {
  const token = await getAuthToken();
  return fetchQuery(api.clips.getClip, { id }, { token });
}
