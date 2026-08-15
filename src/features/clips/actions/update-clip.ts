'use server';

import 'server-only';
import type { ClipId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { stripEmptyStrings } from '@/lib/forms/schemas';
import {
  mapConvexErrorToFormErrors,
  mapZodErrors,
} from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import { clipFormSchema } from '../schemas/clip-form';

export async function updateClipAction(
  data: unknown,
  clipId: ClipId
): Promise<ActionResult<{ clipId: ClipId }>> {
  await requireAdminUser();

  const parsed = clipFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: mapZodErrors(parsed.error),
      success: false,
    };
  }

  try {
    await fetchAuthMutation(api.clips.updateClip, {
      ...stripEmptyStrings(parsed.data),
      clipId,
    });

    updateTag('clips');

    return {
      data: { clipId },
      success: true,
    };
  } catch (error) {
    return {
      errors: mapConvexErrorToFormErrors(error),
      success: false,
    };
  }
}
