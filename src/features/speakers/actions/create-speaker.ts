'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { SpeakerId } from '../types';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { createSpeakerSchema } from '../schemas/speaker-form';

/**
 * Creates a new speaker. Validates data on server and requires admin authorization.
 */
export async function createSpeakerAction(
  data: unknown,
): Promise<ActionResult<{ speakerId: SpeakerId }>> {
  // Re-verify authorization on every request
  await requireAdminUser();

  const parsed = createSpeakerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    const speakerId = await fetchAuthMutation(api.speakers.createSpeaker, {
      ...parsed.data,
      role: parsed.data.role || undefined,
    });

    return {
      success: true,
      data: { speakerId },
    };
  } catch (error) {
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
