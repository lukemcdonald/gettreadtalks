'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { ClipId } from '../types';

import { revalidateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { clipFormSchema } from '../schemas/clip-form';

export async function updateClipAction(
  data: unknown,
  clipId: ClipId,
): Promise<ActionResult<{ clipId: ClipId }>> {
  await requireAdminUser();

  const parsed = clipFormSchema.safeParse(data);

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

    revalidateTag('clips', 'hours');

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
