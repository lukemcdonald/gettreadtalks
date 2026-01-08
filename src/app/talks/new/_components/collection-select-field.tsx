import type { Collection, CollectionId } from '@/features/collections/types';

import {
  Field,
  FieldLabel,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

type CollectionSelectFieldProps = {
  collections: Pick<Collection, '_id' | 'title'>[];
  onValueChange?: (value: CollectionId | '') => void;
  placeholder?: string;
  value?: CollectionId;
};

export function CollectionSelectField({
  collections,
  onValueChange,
  placeholder,
  value,
}: CollectionSelectFieldProps) {
  const items = collections.map((collection) => ({
    label: collection.title,
    value: collection._id,
  }));

  const allOption = placeholder ? { label: placeholder, value: '' } : null;
  const allOptions = allOption ? [allOption, ...items] : items;

  const normalizedValue = value || '';

  return (
    <Field name="collectionId">
      <FieldLabel htmlFor="collectionId">Collection</FieldLabel>
      <Select
        items={allOptions}
        name="collectionId"
        onValueChange={(v) => onValueChange?.(v as CollectionId)}
        value={normalizedValue}
      >
        <SelectTrigger id="collectionId">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          <SelectItem value="">None</SelectItem>
          {collections.map((collection) => (
            <SelectItem key={collection._id} value={collection._id}>
              {collection.title}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
}
