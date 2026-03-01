'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { SpeakerId } from '../types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { stripEmptyStrings } from '@/lib/forms/schemas';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { createSpeakerSchema } from '../schemas/speaker-form';

export async function createSpeakerAction(
  data: unknown,
): Promise<ActionResult<{ speakerId: SpeakerId }>> {
  await requireAdminUser();

  const parsed = createSpeakerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    const speakerId = await fetchAuthMutation(
      api.speakers.createSpeaker,
      stripEmptyStrings(parsed.data),
    );

    updateTag('speakers');
    updateTag('form-options');

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
