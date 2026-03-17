import type { CollectionData } from '@/features/collections/types';

import { CollectionTalkList } from '@/features/collections/components/collection-talk-list';

interface CollectionContentProps {
  talks: CollectionData['talks'];
}

export function CollectionContent({ talks }: CollectionContentProps) {
  return <CollectionTalkList talks={talks} />;
}
