'use server';

import 'server-only';
import type { TalkId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

export async function unpublishTalkStudyAction(
  talkId: TalkId
): Promise<ActionResult<{ talkId: string }>> {
  await requireAdminUser();

  try {
    await fetchAuthMutation(api.talks.unpublishTalkStudy, { talkId });

    updateTag('talks');

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
