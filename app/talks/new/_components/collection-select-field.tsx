import type { Id } from '@/convex/_generated/dataModel';

import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CollectionSelectFieldProps {
  collections: Array<{ _id: Id<'collections'>; title: string }>;
  defaultValue?: Id<'collections'> | null;
}

export function CollectionSelectField({ collections, defaultValue }: CollectionSelectFieldProps) {
  const items = [
    { label: 'None', value: '' },
    ...collections.map((collection) => ({
      label: collection.title,
      value: collection._id,
    })),
  ];

  return (
    <div>
      <Label htmlFor="collectionId">Collection</Label>
      <Select defaultValue={defaultValue ?? undefined} items={items} name="collectionId">
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
