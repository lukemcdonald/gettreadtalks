'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';

import { fetchMutation } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { withConvexAuth } from '@/lib/convex/server-action';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { requireAdminUser } from '@/services/auth/server';
import { type TalkFormData, talkFormSchema } from '../schemas/talk-form';

/**
 * Creates a new talk.
 *
 * @param data - Form data (validated client-side, re-validated on server)
 * @returns Success result with talkId or error result with field errors
 */
export async function createTalkAction(data: unknown): Promise<ActionResult<{ talkId: string }>> {
  // Re-verify authorization on every request
  await requireAdminUser();

  // Validate data on server (client validation can be bypassed)
  const parsed = talkFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: mapZodErrors(parsed.error) };
  }

  const validatedData: TalkFormData = parsed.data;

  try {
    // Call Convex mutation with authenticated token
    const talkId = await withConvexAuth(
      async (token) => await fetchMutation(api.talks.createTalk, validatedData, { token }),
    );

    return {
      success: true,
      data: { talkId },
    };
  } catch (error) {
    // Map Convex errors to form errors using structured error data
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
