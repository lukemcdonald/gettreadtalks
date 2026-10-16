import 'server-only';
import type { AdminEntity } from '@/lib/entities/paths';

import { redirect } from 'next/navigation';

import { buildEntityEditPath } from '@/lib/entities/paths';
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
    redirect(buildEntityEditPath(entity, id));
  }

  redirect(publicPath);
}
