import { EditorialProfileLayout } from '@/components/layouts';
import { EditorialProfileHeroSkeleton } from '@/components/skeletons';

export function ClipPageSkeleton() {
  return <EditorialProfileLayout hero={<EditorialProfileHeroSkeleton />} />;
}
