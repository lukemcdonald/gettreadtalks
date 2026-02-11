'use server';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Update user display name. Requires authentication.
 */
export async function updateProfile({ name }: { name: string }) {
  const authToken = await getAuthToken();

  await fetchMutation(api.users.updateUserProfile, { name }, { token: authToken });
}
