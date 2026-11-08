'use server';

import 'server-only';
import type { ActionResult } from '@/lib/forms/types';

import { zid } from 'convex-helpers/server/zod4';
import { updateTag } from 'next/cache';
import { z } from 'zod';

import { api } from '@/convex/_generated/api';
import { toConvexFormErrors, toZodFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

const publishStudyDraftsSchema = z.object({
  featureIds: z.array(zid('talkFeatures')).max(1000),
});

export async function publishStudyDraftsAction(
  featureIds: unknown
): Promise<ActionResult<{ published: number; skipped: number }>> {
  await requireAdminUser();

  const parsed = publishStudyDraftsSchema.safeParse({ featureIds });

  if (!parsed.success) {
    return { errors: toZodFormErrors(parsed.error), success: false };
  }

  try {
    const data = await fetchAuthMutation(api.talkFeatures.publishStudyDrafts, {
      featureIds: parsed.data.featureIds,
    });
    updateTag('talks');
    return { data, success: true };
  } catch (error) {
    return { errors: toConvexFormErrors(error), success: false };
  }
}
