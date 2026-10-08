'use server';

import { refresh, updateTag } from 'next/cache';

// oxlint-disable-next-line require-await -- Server Actions must be async
export async function revalidateUserLists({
  refreshPage = false,
}: {
  refreshPage?: boolean;
} = {}) {
  updateTag('user-favorites');
  updateTag('user-finished-talks');

  if (refreshPage) {
    refresh();
  }
}
