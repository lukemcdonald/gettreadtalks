'use server';

import type { ActionResult } from '@/lib/forms/types';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors } from '@/lib/forms/validation';
import { getAuthToken } from '@/services/auth/server';
import { captureException } from '@/services/errors';
import { ErrorCodes } from '@/services/errors/constants';
import { getConvexErrorData, isConvexError } from '@/services/errors/convex';

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
    if (isUnexpectedDeleteAccountError(error)) {
      captureException(error, { fingerprint: ['auth', 'deleteAccount'] });
    }

    return { errors: toConvexFormErrors(error), success: false };
  }
}

function isUnexpectedDeleteAccountError(error: unknown) {
  if (!isConvexError(error)) {
    return true;
  }

  const { errorCode } = getConvexErrorData(error);

  return (
    errorCode !== ErrorCodes.VALIDATION_FAILED &&
    errorCode !== ErrorCodes.AUTH_REQUIRED
  );
}
