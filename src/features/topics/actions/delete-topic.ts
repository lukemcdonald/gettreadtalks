'use server';

import 'server-only';
import type { TopicId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

export async function deleteTopicAction(
  topicId: TopicId
): Promise<ActionResult<null>> {
  await requireAdminUser();

  try {
    await fetchAuthMutation(api.topics.destroyTopic, { id: topicId });

    updateTag('topics');

    return {
      data: null,
      success: true,
    };
  } catch (error) {
    return {
      errors: toConvexFormErrors(error),
      success: false,
    };
  }
}
