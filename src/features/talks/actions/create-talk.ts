'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { withConvexAuth } from '@/lib/convex/server-action';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { requireAdminUser } from '@/services/auth/server';
import { talkFormSchema } from '../schemas/talk-form';

/**
 * Creates a new talk. Validates data on server and requires admin authorization.
 */
export async function createTalkAction(data: unknown): Promise<ActionResult<{ talkId: string }>> {
  // Re-verify authorization on every request
  await requireAdminUser();

  const parsed = talkFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    const talkId = await withConvexAuth(
      async (token) => await fetchMutation(api.talks.createTalk, parsed.data, { token }),
    );

    return {
      success: true,
      data: { talkId },
    };
  } catch (error) {
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
