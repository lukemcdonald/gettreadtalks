'use server';

import 'server-only';
import { updateTag } from 'next/cache';

import { requireAdminUser } from '@/services/auth/server';

/**
 * Refresh public talk pages after a write made outside a server action, such as summary generation.
 */
export async function updateTalksCacheAction() {
  await requireAdminUser();
  updateTag('talks');
}
