'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { SpeakerId } from '../types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

export async function destroySpeakerAction(speakerId: SpeakerId): Promise<ActionResult<null>> {
  await requireAdminUser();

  try {
    await fetchAuthMutation(api.speakers.destroySpeaker, { speakerId });

    updateTag('speakers');

    return { success: true, data: null };
  } catch (error) {
    return { success: false, errors: mapConvexErrorToFormErrors(error) };
  }
}
