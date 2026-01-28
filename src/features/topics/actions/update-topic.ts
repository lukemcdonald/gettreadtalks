'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { TopicId } from '../types';

import { revalidateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { topicFormSchema } from '../schemas/topic-form';

export async function updateTopicAction(
  data: unknown,
  topicId: TopicId,
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
    await fetchAuthMutation(api.topics.updateTopic, {
      id: topicId,
      title: parsed.data.title,
    });

    revalidateTag('topics', 'hours');

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
