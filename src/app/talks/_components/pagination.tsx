'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui';

type PaginationProps = {
  continueCursor: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function Pagination({ continueCursor, hasNextPage, hasPrevPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (cursor: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (cursor) {
      params.set('cursor', cursor);
    } else {
      params.delete('cursor');
    }

    const query = params.toString();
    router.push(query ? `/talks?${query}` : '/talks');
  };

  if (!(hasNextPage || hasPrevPage)) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        disabled={!hasPrevPage}
        onClick={() => handlePageChange(null)}
        size="sm"
        variant="outline"
      >
        Previous
      </Button>
      <Button
        disabled={!hasNextPage}
        onClick={() => handlePageChange(continueCursor)}
        size="sm"
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}
