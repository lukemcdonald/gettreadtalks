'use server';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Update user password. Requires authentication.
 */
export async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const authToken = await getAuthToken();

  await fetchMutation(
    api.users.updatePassword,
    { currentPassword, newPassword },
    { token: authToken },
  );
}
