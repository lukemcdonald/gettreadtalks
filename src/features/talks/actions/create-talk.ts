'use server';

import 'server-only';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import {
  mapConvexErrorToFormErrors,
  mapZodErrors,
} from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import { talkFormSchema } from '../schemas/talk-form';

/**
 * Creates a new talk. Validates data on server and requires admin authorization.
 */
export async function createTalkAction(
  data: unknown
): Promise<ActionResult<{ talkId: string }>> {
  // Re-verify authorization on every request
  await requireAdminUser();

  const parsed = talkFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: mapZodErrors(parsed.error),
      success: false,
    };
  }

  try {
    const talkId = await fetchAuthMutation(api.talks.createTalk, parsed.data);

    updateTag('talks');
    updateTag('form-options');
    updateTag('topics');

    return {
      data: { talkId },
      success: true,
    };
  } catch (error) {
    return {
      errors: mapConvexErrorToFormErrors(error),
      success: false,
    };
  }
}
