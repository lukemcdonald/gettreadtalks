'use server';

import type { ActionResult } from '@/lib/forms/types';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors } from '@/lib/forms/validation';
import { getAuthToken } from '@/services/auth/server';

/**
 * Delete user account. Requires authentication and password confirmation.
 */
export async function deleteAccount({
  password,
}: {
  password: string;
}): Promise<ActionResult<null>> {
  const authToken = await getAuthToken();

  try {
    await fetchMutation(
      api.users.deleteUser,
      { password },
      { token: authToken }
    );

    return { data: null, success: true };
  } catch (error) {
    return { errors: toConvexFormErrors(error), success: false };
  }
}
