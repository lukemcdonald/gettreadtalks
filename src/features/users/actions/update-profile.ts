'use server';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Update user profile (name and/or email). Requires authentication.
 */
export async function updateProfile({ email, name }: { email?: string; name?: string }) {
  const authToken = await getAuthToken();

  await fetchMutation(api.users.updateUserProfile, { email, name }, { token: authToken });
}
