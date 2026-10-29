'use server';

import 'server-only';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { parseUtcDate } from '@/convex/lib/publishedAt';
import { toConvexFormErrors, toZodFormErrors } from '@/lib/forms/validation';
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
      errors: toZodFormErrors(parsed.error),
      success: false,
    };
  }

  try {
    const { publishedAt, ...talk } = parsed.data;
    const talkId = await fetchAuthMutation(api.talks.createTalk, {
      ...talk,
      publishedAt: publishedAt ? parseUtcDate(publishedAt) : undefined,
    });

    updateTag('talks');
    updateTag('form-options');
    updateTag('topics');

    return {
      data: { talkId },
      success: true,
    };
  } catch (error) {
    return {
      errors: toConvexFormErrors(error),
      success: false,
    };
  }
}
