import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Suspense } from 'react';

import { AdminEditButton } from '@/components/admin-edit-button';
import { MetadataGroup } from '@/components/metadata-group';
import { FeatureTalkButton } from '@/features/talks/components/feature-talk-button';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

interface TalkAdminActionsProps {
  speaker: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'featured' | 'slug'>;
}

async function TalkAdminActionsGroup({ speaker, talk }: TalkAdminActionsProps) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return null;
  }

  return (
    <MetadataGroup label="Admin">
      <div className="flex flex-wrap items-center gap-2">
        <AdminEditButton entity="talks" id={talk._id} />
        <FeatureTalkButton speaker={speaker} talk={talk} />
      </div>
    </MetadataGroup>
  );
}

export function TalkAdminActions(delegated: TalkAdminActionsProps) {
  return (
    <Suspense fallback={null}>
      <TalkAdminActionsGroup {...delegated} />
    </Suspense>
  );
}
