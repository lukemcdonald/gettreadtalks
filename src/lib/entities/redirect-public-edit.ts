import 'server-only';
import type { AdminEntity } from '@/lib/entities/paths';

import { redirect } from 'next/navigation';

import { getEntityEditPath } from '@/lib/entities/paths';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

export async function redirectPublicEdit({
  entity,
  id,
  publicPath,
}: {
  entity: AdminEntity;
  id: string;
  publicPath: string;
}) {
  const user = await getCurrentUser();

  if (isAdmin(user)) {
    redirect(getEntityEditPath(entity, id));
  }

  redirect(publicPath);
}
