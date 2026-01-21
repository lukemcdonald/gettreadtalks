'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { SpeakerId } from '../types';

import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

const updateSpeakerSchema = z.object({
  description: z.string().optional(),
  featured: z.boolean().optional(),
  firstName: z.string().trim().min(1, 'First name is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  lastName: z.string().trim().min(1, 'Last name is required'),
  ministry: z.string().optional(),
  role: z.string().optional(),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

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
