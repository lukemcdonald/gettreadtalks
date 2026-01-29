'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui';

interface PaginationProps {
  continueCursor: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemCount: number;
}

export function Pagination({
  continueCursor,
  hasNextPage,
  hasPrevPage,
  itemCount,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (itemCount === 0 || !(hasNextPage || hasPrevPage)) {
    return null;
  }

  function handlePrevious() {
    const params = new URLSearchParams(searchParams.toString());

    // Get the previous cursor from URL (stored when we navigated forward)
    const prevCursor = params.get('prevCursor');

    // Remove current cursor
    params.delete('cursor');
    params.delete('prevCursor');

    // If we have a previous cursor, set it as the current cursor
    if (prevCursor) {
      params.set('cursor', prevCursor);
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname);
  }

  function handleNext() {
    if (!continueCursor) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());

    // Store current cursor as previous before moving forward
    const currentCursor = params.get('cursor');
    if (currentCursor) {
      params.set('prevCursor', currentCursor);
    } else {
      params.delete('prevCursor');
    }

    params.set('cursor', continueCursor);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button disabled={!hasPrevPage} onClick={handlePrevious} variant="outline">
        Previous
      </Button>
      <Button disabled={!hasNextPage} onClick={handleNext} variant="outline">
        Next
      </Button>
    </div>
  );
}
