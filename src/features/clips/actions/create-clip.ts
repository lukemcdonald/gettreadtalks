'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { ClipId } from '../types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { stripEmptyStrings } from '@/lib/forms/schemas';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { clipFormSchema } from '../schemas/clip-form';

export async function createClipAction(data: unknown): Promise<ActionResult<{ clipId: ClipId }>> {
  await requireAdminUser();

  const parsed = clipFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    const clipId = await fetchAuthMutation(api.clips.createClip, stripEmptyStrings(parsed.data));

    updateTag('clips');

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
