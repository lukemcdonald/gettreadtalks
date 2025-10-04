import { getToken } from '@convex-dev/better-auth/nextjs';
import { createAuth } from '@convex/auth';

export const getAuthToken = () => {
  return getToken(createAuth);
};
