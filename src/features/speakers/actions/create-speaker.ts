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

  // Validate data on server (client validation can be bypassed)
  const parsed = createSpeakerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: mapZodErrors(parsed.error) };
  }

  const validatedData: CreateSpeakerData = parsed.data;

  // Clean up empty strings to undefined for optional fields
  const mutationData = {
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    role: validatedData.role || undefined,
    ministry: validatedData.ministry || undefined,
    description: validatedData.description || undefined,
    websiteUrl: validatedData.websiteUrl || undefined,
    imageUrl: validatedData.imageUrl || undefined,
  };

  try {
    // Call Convex mutation with authenticated token
    const speakerId = await withConvexAuth(
      async (token) => await fetchMutation(api.speakers.createSpeaker, mutationData, { token }),
    );

    return {
      success: true,
      data: { speakerId },
    };
  } catch (error) {
    // Map Convex errors to form errors using structured error data
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
