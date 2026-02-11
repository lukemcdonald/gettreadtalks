'use server';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Update user password. Requires authentication.
 */
export async function updateUserPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const authToken = await getAuthToken();

  await fetchMutation(
    api.users.updateUserPassword,
    { currentPassword, newPassword },
    { token: authToken },
  );
}
