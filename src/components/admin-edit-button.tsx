'use client';

import type { AdminEntity } from '@/lib/entities/paths';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';
import { getEntityEditPath } from '@/lib/entities/paths';

interface AdminEditButtonProps {
  entity: AdminEntity;
  id: string;
}

export function AdminEditButton({ entity, id }: AdminEditButtonProps) {
  const isAdminUser = useIsAdmin();

  if (!isAdminUser) {
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
