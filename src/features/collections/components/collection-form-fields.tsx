import type { Control } from 'react-hook-form';
import type { CollectionFormData } from '../schemas/collection-form';

import { TextField, TextareaField, UrlField } from '@/components/ui';

interface CollectionFormFieldsProps {
  control: Control<CollectionFormData>;
}

export function CollectionFormFields({ control }: CollectionFormFieldsProps) {
  return (
    <div className="space-y-4">
      <TextField
        control={control}
        description="Name of the sermon series or collection"
        label="Title"
        name="title"
        placeholder="Romans Series"
        required
      />

      <TextareaField
        control={control}
        description="Brief description of this collection"
        label="Description"
        name="description"
        placeholder="A verse-by-verse study through the book of Romans..."
        rows={3}
      />

      <UrlField
        control={control}
        description="Link to the collection's page on the speaker's site"
        label="URL"
        name="url"
        placeholder="https://example.com/series/romans"
      />
    </div>
  );
}
