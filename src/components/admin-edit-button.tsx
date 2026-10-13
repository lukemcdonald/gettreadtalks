import type { AdminEntity } from '@/lib/entities/paths';

import { Suspense } from 'react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { getEntityEditPath } from '@/lib/entities/paths';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

interface AdminEditButtonProps {
  entity: AdminEntity;
  id: string;
}

async function AdminEditLink({ entity, id }: AdminEditButtonProps) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return null;
  }

  return (
    <Button
      data-testid="admin-edit"
      render={<Link href={getEntityEditPath(entity, id)} />}
      size="sm"
      variant="outline"
    >
      Edit
    </Button>
  );
}

export function AdminEditButton({ entity, id }: AdminEditButtonProps) {
  return (
    <Suspense fallback={null}>
      <AdminEditLink entity={entity} id={id} />
    </Suspense>
  );
}
