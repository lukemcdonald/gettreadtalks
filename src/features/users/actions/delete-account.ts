'use server';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Delete user account. Requires authentication and password confirmation.
 */
export async function deleteAccount({ password }: { password: string }) {
  const authToken = await getAuthToken();

  await fetchMutation(api.users.deleteUser, { password }, { token: authToken });
}
