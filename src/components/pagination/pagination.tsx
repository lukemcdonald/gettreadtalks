'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui';

type PaginationProps = {
  continueCursor: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function Pagination({ continueCursor, hasNextPage, hasPrevPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!(hasNextPage || hasPrevPage)) {
    return null;
  }

  function handlePrevious() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('cursor');
    router.push(`?${params.toString()}`);
  }

  function handleNext() {
    if (!continueCursor) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
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
