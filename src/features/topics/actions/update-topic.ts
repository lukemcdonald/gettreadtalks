'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { TopicId } from '../types';

import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

const updateTopicSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
});

export async function updateTopicAction(
  data: unknown,
  topicId: TopicId,
): Promise<ActionResult<{ topicId: TopicId }>> {
  await requireAdminUser();

  const parsed = updateTopicSchema.safeParse(data);

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
