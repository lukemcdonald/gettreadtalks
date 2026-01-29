'use server';

import 'server-only';

import type { ActionResult } from '@/lib/forms/types';
import type { CollectionId } from '../types';

import { revalidateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors, mapZodErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';
import { collectionFormSchema } from '../schemas/collection-form';

export async function createCollectionAction(
  data: unknown,
): Promise<ActionResult<{ collectionId: CollectionId }>> {
  await requireAdminUser();

  const parsed = collectionFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: mapZodErrors(parsed.error),
    };
  }

  try {
    const collectionId = await fetchAuthMutation(api.collections.createCollection, {
      description: parsed.data.description || undefined,
      title: parsed.data.title,
      url: parsed.data.url || undefined,
    });

    revalidateTag('collections', 'hours');

    return {
      success: true,
      data: { collectionId },
    };
  } catch (error) {
    return {
      success: false,
      errors: mapConvexErrorToFormErrors(error),
    };
  }
}
