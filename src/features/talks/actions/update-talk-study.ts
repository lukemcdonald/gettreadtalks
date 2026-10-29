'use server';

import 'server-only';
import type { TalkId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors, toZodFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import {
  talkStudyContentFormSchema,
  talkStudyFormSchema,
} from '../schemas/talk-study-form';

async function saveTalkStudy(
  data: Record<string, unknown>,
  talkId: TalkId
): Promise<ActionResult<{ talkId: string }>> {
  try {
    await fetchAuthMutation(api.talks.updateTalkStudy, {
      ...data,
      talkId,
    });
    updateTag('talks');
    return { data: { talkId }, success: true };
  } catch (error) {
    return { errors: toConvexFormErrors(error), success: false };
  }
}

export async function updateTalkStudyAction(
  data: unknown,
  talkId: TalkId
): Promise<ActionResult<{ talkId: string }>> {
  await requireAdminUser();

  const parsed = talkStudyFormSchema.safeParse(data);

  if (!parsed.success) {
    return { errors: toZodFormErrors(parsed.error), success: false };
  }

  return await saveTalkStudy(parsed.data, talkId);
}

export async function updateTalkStudyContentAction(
  data: unknown,
  talkId: TalkId
): Promise<ActionResult<{ talkId: string }>> {
  await requireAdminUser();

  const parsed = talkStudyContentFormSchema.safeParse(data);

  if (!parsed.success) {
    return { errors: toZodFormErrors(parsed.error), success: false };
  }

  return await saveTalkStudy(parsed.data, talkId);
}
