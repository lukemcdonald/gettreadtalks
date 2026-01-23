import { Skeleton } from '@/components/ui';
import { SheetScrollLock } from './_components/sheet-scroll-lock';

export default function SheetLoading() {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <SheetScrollLock />

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/32 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative flex w-[calc(100%-(--spacing(12)))] max-w-md flex-col border-s bg-popover shadow-lg/5">
        {/* Header */}
        <div className="flex flex-col gap-2 p-6">
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Form fields skeleton */}
        <div className="flex-1 space-y-5 overflow-hidden px-6 pt-1">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t bg-muted/72 px-6 py-4">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
