'use server';

import 'server-only';
import type { TalkId } from '../types';
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
 * Updates an existing talk. Validates data on server and requires admin authorization.
 */
export async function updateTalkAction(
  data: unknown,
  talkId: TalkId
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
    await fetchAuthMutation(api.talks.updateTalk, { ...parsed.data, talkId });

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
