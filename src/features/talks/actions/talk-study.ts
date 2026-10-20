'use server';

import 'server-only';
import type { TalkId, TalkStudy } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors, toZodFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import {
  parseSuggestedTopics,
  talkStudyFormSchema,
} from '../schemas/talk-study-form';

async function writeTalkStudy(
  talkId: TalkId,
  write: () => Promise<unknown>
): Promise<ActionResult<{ talkId: string }>> {
  await requireAdminUser();

  try {
    await write();
    updateTag('talks');
    return { data: { talkId }, success: true };
  } catch (error) {
    return { errors: toConvexFormErrors(error), success: false };
  }
}

export async function setTalkStudyStatusAction(
  talkId: TalkId,
  studyStatus: TalkStudy['studyStatus']
) {
  return await writeTalkStudy(talkId, () =>
    fetchAuthMutation(api.talks.setTalkStudyStatus, { studyStatus, talkId })
  );
}

export async function updateTalkStudyAction(data: unknown, talkId: TalkId) {
  const parsed = talkStudyFormSchema.safeParse(data);

  if (!parsed.success) {
    return { errors: toZodFormErrors(parsed.error), success: false as const };
  }

  return await writeTalkStudy(talkId, () =>
    fetchAuthMutation(api.talks.updateTalkStudy, {
      ...parsed.data,
      suggestedTopics: parseSuggestedTopics(parsed.data.suggestedTopics),
      talkId,
    })
  );
}
