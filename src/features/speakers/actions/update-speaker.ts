'use server';

import 'server-only';
import type { SpeakerId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { stripEmptyStrings } from '@/lib/forms/schemas';
import {
  mapConvexErrorToFormErrors,
  mapZodErrors,
} from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import { updateSpeakerSchema } from '../schemas/speaker-form';

export async function updateSpeakerAction(
  data: unknown,
  speakerId: SpeakerId
): Promise<ActionResult<{ speakerId: SpeakerId }>> {
  await requireAdminUser();

  const parsed = updateSpeakerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: mapZodErrors(parsed.error),
      success: false,
    };
  }

  try {
    await fetchAuthMutation(api.speakers.updateSpeaker, {
      ...stripEmptyStrings(parsed.data),
      speakerId,
    });

    updateTag('speakers');
    updateTag('form-options');

    return {
      data: { speakerId },
      success: true,
    };
  } catch (error) {
    return {
      errors: mapConvexErrorToFormErrors(error),
      success: false,
    };
  }
}
