import { Card, Skeleton } from '@/components/ui';

export function CollectionCardSkeleton() {
  return (
    <Card className="flex flex-col gap-3 border-0 p-4">
      <Skeleton className="h-5 w-48" />
    </Card>
  );
}
