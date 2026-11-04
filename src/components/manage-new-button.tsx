import type { AdminEntity } from '@/lib/entities/paths';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';
import { buildEntityNewPath } from '@/lib/entities/paths';

const ENTITY_LABEL = {
  clips: 'clip',
  collections: 'collection',
  speakers: 'speaker',
  talks: 'talk',
  topics: 'topic',
} as const satisfies Record<AdminEntity, string>;

export function ManageNewButton({ entity }: { entity: AdminEntity }) {
  const label = ENTITY_LABEL[entity];

  return (
    <Button
      aria-label={`New ${label}`}
      data-testid={`new-${label}`}
      render={<Link href={buildEntityNewPath(entity)} />}
      size="sm"
    >
      <PlusIcon aria-hidden="true" className="size-4" />
      New
    </Button>
  );
}
