'use server';

import 'server-only';
import type { TalkId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import {
  toTalkStudyKeyPassages,
  toTalkStudyMainPoints,
} from '@/convex/model/talks/scriptureRef';
import { toConvexFormErrors, toZodFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import {
  talkStudyContentFormSchema,
  talkStudyFormSchema,
} from '../schemas/talk-study-form';

export async function updateTalkStudyAction(
  data: unknown,
  talkId: TalkId
): Promise<ActionResult<{ talkId: string }>> {
  await requireAdminUser();

  const parsed = talkStudyFormSchema.safeParse(data);

  if (!parsed.success) {
    return { errors: toZodFormErrors(parsed.error), success: false };
  }

  try {
    await fetchAuthMutation(api.talks.updateTalkStudy, {
      ...parsed.data,
      talkId,
    });
    updateTag('talks');
    return { data: { talkId }, success: true };
  } catch (error) {
    return { errors: toConvexFormErrors(error), success: false };
  }
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

  try {
    await fetchAuthMutation(api.talks.updateTalkStudy, {
      keyPassages: toTalkStudyKeyPassages(parsed.data.keyPassages),
      mainPoints: toTalkStudyMainPoints(parsed.data.mainPoints),
      talkId,
    });
    updateTag('talks');
    return { data: { talkId }, success: true };
  } catch (error) {
    return { errors: toConvexFormErrors(error), success: false };
  }
}
