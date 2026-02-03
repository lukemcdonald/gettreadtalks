import { Card, Skeleton } from '@/components/ui';

export function TopicCardSkeleton() {
  return (
    <Card className="flex-row items-center justify-between gap-4 p-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-16" />
    </Card>
  );
}
