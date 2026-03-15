'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { TopicId } from '../types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

export async function destroyTopicAction(topicId: TopicId): Promise<ActionResult<null>> {
  await requireAdminUser();

  try {
    await fetchAuthMutation(api.topics.destroyTopic, { id: topicId });

    updateTag('topics');

    return { success: true, data: null };
  } catch (error) {
    return { success: false, errors: mapConvexErrorToFormErrors(error) };
  }
}
