import { Card, CardContent, CardHeader, Skeleton } from '@/components/ui';

export function CollectionCardSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-16" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
