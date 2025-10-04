'use server';

import { api } from '@/convex/_generated/api';
import { fetchMutation } from 'convex/nextjs';

import { getAuthToken } from '@/lib/services/auth/server';

// Authenticated mutation via server function
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
