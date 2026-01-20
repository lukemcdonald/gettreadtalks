'use client';

import { useRouter } from 'next/navigation';

import { Button, Empty, EmptyDescription, EmptyTitle } from '@/components/ui';

interface ListEmptyProps {
  clearPath: string;
  description: string;
  filteredDescription: string;
  hasActiveFilters: boolean;
  title: string;
}

/**
 * Empty state for filtered list views.
 * Shows context-aware messaging and optional "Clear filters" button.
 */
export function ListEmpty({
  clearPath,
  description,
  filteredDescription,
  hasActiveFilters,
  title,
}: ListEmptyProps) {
  const router = useRouter();

  function handleClearFilters() {
    router.push(clearPath);
  }

  const message = hasActiveFilters ? filteredDescription : description;

  return (
    <Empty>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{message}</EmptyDescription>
      {hasActiveFilters ? (
        <Button className="mt-4" onClick={handleClearFilters} variant="outline">
          Clear all filters
        </Button>
      ) : null}
    </Empty>
  );
}
