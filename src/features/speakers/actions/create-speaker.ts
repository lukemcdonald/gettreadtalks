'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { SpeakerId } from '../types';

import { fetchMutation } from 'convex/nextjs';
import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { withConvexAuth } from '@/lib/convex/server-action';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { requireAdminUser } from '@/services/auth/server';

/**
 * Zod schema for creating a speaker.
 * Used for form validation in Server Actions.
 */
const createSpeakerSchema = z.object({
  description: z.string().optional(),
  firstName: z.string().trim().min(1, 'First name is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  lastName: z.string().trim().min(1, 'Last name is required'),
  ministry: z.string().optional(),
  role: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
});

type CreateSpeakerData = z.infer<typeof createSpeakerSchema>;

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
    const speakerId = await withConvexAuth(
      async (token) => await fetchMutation(api.speakers.createSpeaker, parsed.data, { token }),
    );

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
