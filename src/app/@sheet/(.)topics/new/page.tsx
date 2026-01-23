'use client';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateTopicSheet } from '@/features/topics/components';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return <CreateTopicSheet onOpenChange={handleOpenChange} onTopicCreated={handleSuccess} open />;
}
