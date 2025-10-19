'use server';

import { getToken } from '@convex-dev/better-auth/nextjs';

import { createAuth } from '@/convex/auth';

export const getAuthToken = async () => {
  return await getToken(createAuth);
};
