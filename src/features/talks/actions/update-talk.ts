'use server';

import 'server-only';
import type { TalkId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors, toZodFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import { editTalkFormSchema } from '../schemas/talk-form';

/**
 * Updates an existing talk. Validates data on server and requires admin authorization.
 */
export async function updateTalkAction(
  data: unknown,
  talkId: TalkId
): Promise<ActionResult<{ talkId: string }>> {
  // Re-verify authorization on every request
  await requireAdminUser();

  const parsed = editTalkFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: toZodFormErrors(parsed.error),
      success: false,
    };
  }

  const { study, ...talkData } = parsed.data;

  try {
    await fetchAuthMutation(api.talks.updateTalk, { ...talkData, talkId });

    if (study) {
      await fetchAuthMutation(api.talks.updateTalkStudy, {
        outline: study.outline,
        scriptureRefs: study.scriptureRefs,
        studyGuide: study.studyGuide,
        suggestedTopics: study.suggestedTopics
          .split(',')
          .map((topic) => topic.trim())
          .filter(Boolean),
        summary: study.summary,
        talkId,
      });
    }

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
