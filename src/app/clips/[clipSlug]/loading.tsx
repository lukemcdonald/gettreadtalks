import { EditorialProfileLayout } from '@/components/layouts';
import { EditorialProfileHeroSkeleton } from '@/components/skeletons';

export default function ClipLoading() {
  return (
    <EditorialProfileLayout
      content={null}
      hero={<EditorialProfileHeroSkeleton />}
    />
  );
}
