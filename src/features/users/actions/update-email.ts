'use server';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Update user email address. Requires authentication.
 */
export async function updateEmail({ newEmail }: { newEmail: string }) {
  const authToken = await getAuthToken();

  await fetchMutation(api.users.updateUserEmail, { newEmail }, { token: authToken });
}
