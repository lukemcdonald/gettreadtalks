'use server';

import 'server-only';
import type { TalkFormData } from '../schemas/talk-form';
import type { TalkId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { parseUtcDate } from '@/convex/lib/publishedAt';
import { toConvexFormErrors, toZodFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import { talkFormSchema } from '../schemas/talk-form';
import { talkSummaryFormSchema } from '../schemas/talk-study-form';

function toUpdateTalkInput(
  data: TalkFormData,
  talkId: TalkId,
  summary?: string
) {
  const { format, publishedAt, ...talk } = data;

  return {
    ...talk,
    ...(publishedAt ? { publishedAt: parseUtcDate(publishedAt) } : {}),
    ...(summary === undefined ? {} : { summary }),
    format: format === '' ? null : format,
    talkId,
  };
}

/**
 * Updates an existing talk. Validates data on server and requires admin authorization.
 */
export async function updateTalkAction(
  data: unknown,
  talkId: TalkId,
  summary?: string
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

  if (summary !== undefined) {
    const parsedSummary = talkSummaryFormSchema.safeParse({ summary });

    if (!parsedSummary.success) {
      return {
        errors: toZodFormErrors(parsedSummary.error),
        success: false,
      };
    }
  }

  try {
    await fetchAuthMutation(
      api.talks.updateTalk,
      toUpdateTalkInput(parsed.data, talkId, summary)
    );

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
