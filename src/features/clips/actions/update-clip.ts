'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { ClipId } from '../types';

import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

const updateClipSchema = z.object({
  description: z.string().optional(),
  mediaUrl: z.string().trim().url('Please enter a valid URL'),
  speakerId: zid('speakers').optional(),
  status: z.enum(['approved', 'archived', 'backlog', 'published']).default('backlog'),
  talkId: zid('talks').optional(),
  title: z.string().trim().min(1, 'Title is required'),
});

export async function updateClipAction(
  data: unknown,
  clipId: ClipId,
): Promise<ActionResult<{ clipId: ClipId }>> {
  await requireAdminUser();

  const parsed = updateClipSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    await fetchAuthMutation(api.clips.updateClip, {
      clipId,
      description: parsed.data.description || undefined,
      mediaUrl: parsed.data.mediaUrl,
      speakerId: parsed.data.speakerId || undefined,
      status: parsed.data.status,
      talkId: parsed.data.talkId || undefined,
      title: parsed.data.title,
    });

    return {
      success: true,
      data: { clipId },
    };
  } catch (error) {
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
