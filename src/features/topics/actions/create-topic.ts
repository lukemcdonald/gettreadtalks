'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { TopicId } from '../types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { topicFormSchema } from '../schemas/topic-form';

export async function createTopicAction(
  data: unknown,
): Promise<ActionResult<{ topicId: TopicId }>> {
  await requireAdminUser();

  const parsed = topicFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    const topicId = await fetchAuthMutation(api.topics.createTopic, parsed.data);

    updateTag('topics');

    return {
      success: true,
      data: { topicId },
    };
  } catch (error) {
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
