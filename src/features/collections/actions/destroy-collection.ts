'use server';

import 'server-only';
import type { CollectionId } from '../types';
import type { ActionResult } from '@/lib/forms/types';

import { updateTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { mapConvexErrorToFormErrors } from '@/lib/forms/validation';
import { fetchAuthMutation, requireAdminUser } from '@/services/auth/server';

export async function destroyCollectionAction(
  collectionId: CollectionId
): Promise<ActionResult<null>> {
  await requireAdminUser();

  try {
    await fetchAuthMutation(api.collections.destroyCollection, {
      collectionId,
    });

    updateTag('collections');

    return { data: null, success: true };
  } catch (error) {
    return { errors: mapConvexErrorToFormErrors(error), success: false };
  }
}
