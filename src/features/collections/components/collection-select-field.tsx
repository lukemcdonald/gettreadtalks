'use client';

import type { Collection, CollectionId } from '@/features/collections/types';

import { OptionalSelect } from '@/components/ui';

interface CollectionSelectFieldProps {
  collections: Pick<Collection, '_id' | 'title'>[];
  onValueChange?: (value: CollectionId | undefined) => void;
  placeholder?: string;
  value?: CollectionId;
}

export function CollectionSelectField({
  collections,
  onValueChange,
  placeholder,
  value,
}: CollectionSelectFieldProps) {
  return (
    <OptionalSelect
      items={collections.map((collection) => ({
        label: collection.title,
        value: collection._id,
      }))}
      label="Collection"
      name="collectionId"
      noneLabel={placeholder || 'None'}
      onValueChange={(nextValue) => {
        onValueChange?.(nextValue);
      }}
      value={value}
    />
  );
}
