'use server';

import 'server-only';
import type { TopicId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import {
  mapConvexErrorToFormErrors,
  mapZodErrors,
} from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import { topicFormSchema } from '../schemas/topic-form';

export async function updateTopicAction(
  data: unknown,
  topicId: TopicId
): Promise<ActionResult<{ topicId: TopicId }>> {
  await requireAdminUser();

  const parsed = topicFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: mapZodErrors(parsed.error),
      success: false,
    };
  }

  try {
    await fetchAuthMutation(api.topics.updateTopic, {
      id: topicId,
      title: parsed.data.title,
    });

    updateTag('topics');

    return {
      data: { topicId },
      success: true,
    };
  } catch (error) {
    return {
      errors: mapConvexErrorToFormErrors(error),
      success: false,
    };
  }
}
