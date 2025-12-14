import type { Collection, CollectionId } from '@/features/collections/types';

import {
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

type CollectionSelectFieldProps = {
  collections: Pick<Collection, '_id' | 'title'>[];
  defaultValue?: CollectionId | null;
  onValueChange?: (value: CollectionId | '') => void;
  placeholder?: string;
  value?: CollectionId | '';
};

export function CollectionSelectField({
  collections,
  defaultValue,
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

  return (
    <div>
      <Label htmlFor="collectionId">Collection</Label>
      <Select
        defaultValue={defaultValue}
        items={allOptions}
        name="collectionId"
        onValueChange={(v) => onValueChange?.(v as CollectionId)}
        value={value}
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
    </div>
  );
}
