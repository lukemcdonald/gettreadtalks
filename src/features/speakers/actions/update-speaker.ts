'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { SpeakerId } from '../types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { updateSpeakerSchema } from '../schemas/speaker-form';

export async function updateSpeakerAction(
  data: unknown,
  speakerId: SpeakerId,
): Promise<ActionResult<{ speakerId: SpeakerId }>> {
  await requireAdminUser();

  const parsed = updateSpeakerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    await fetchAuthMutation(api.speakers.updateSpeaker, {
      speakerId,
      description: parsed.data.description || undefined,
      featured: parsed.data.featured,
      firstName: parsed.data.firstName,
      imageUrl: parsed.data.imageUrl || undefined,
      lastName: parsed.data.lastName,
      ministry: parsed.data.ministry || undefined,
      role: parsed.data.role || undefined,
      websiteUrl: parsed.data.websiteUrl || undefined,
    });

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
