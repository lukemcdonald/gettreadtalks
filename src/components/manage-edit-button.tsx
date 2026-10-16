import type { AdminEntity } from '@/lib/entities/paths';

import { PencilIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { getEntityEditPath } from '@/lib/entities/paths';

export function ManageEditButton({
  entity,
  id,
  name,
}: {
  entity: AdminEntity;
  id: string;
  name: string;
}) {
  return (
    <Button
      aria-label={`Edit ${name}`}
      render={<Link href={getEntityEditPath(entity, id)} />}
      size="icon-sm"
      variant="ghost"
    >
      <PencilIcon className="size-4" />
    </Button>
  );
}
