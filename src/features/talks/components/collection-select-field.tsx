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

  const noneOption = { label: placeholder || 'None', value: '' };
  const allOptions = [noneOption, ...items];

  return (
    <Field name="collectionId">
      <FieldLabel htmlFor="collectionId">Collection</FieldLabel>
      <Select
        items={allOptions}
        name="collectionId"
        onValueChange={(v) => onValueChange?.(v as CollectionId)}
        value={value || ''}
      >
        <SelectTrigger id="collectionId">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          {allOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
    </Field>
  );
}
