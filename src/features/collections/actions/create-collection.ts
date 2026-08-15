'use server';

import 'server-only';
import type { CollectionId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { stripEmptyStrings } from '@/lib/forms/schemas';
import {
  mapConvexErrorToFormErrors,
  mapZodErrors,
} from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

import { collectionFormSchema } from '../schemas/collection-form';

export async function createCollectionAction(
  data: unknown
): Promise<ActionResult<{ collectionId: CollectionId }>> {
  await requireAdminUser();

  const parsed = collectionFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      errors: mapZodErrors(parsed.error),
      success: false,
    };
  }

  try {
    const collectionId = await fetchAuthMutation(
      api.collections.createCollection,
      stripEmptyStrings(parsed.data)
    );

    updateTag('collections');
    updateTag('form-options');

    return {
      data: { collectionId },
      success: true,
    };
  } catch (error) {
    return {
      errors: mapConvexErrorToFormErrors(error),
      success: false,
    };
  }
}
