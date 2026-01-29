import type { Control } from 'react-hook-form';
import type { CreateSpeakerFormData, UpdateSpeakerFormData } from '../schemas/speaker-form';

import { SelectField, TextField, TextareaField, UrlField } from '@/components/ui';
import { speakerRoles } from '@/convex/model/speakers/validators';

const roleOptions = [
  { label: 'Select a role', value: '' },
  ...speakerRoles.map((role) => ({ label: role, value: role })),
];

interface SpeakerFormFieldsProps {
  control: Control<CreateSpeakerFormData> | Control<UpdateSpeakerFormData>;
}

export function SpeakerFormFields({ control }: SpeakerFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          control={control}
          label="First Name"
          name="firstName"
          placeholder="John"
          required
        />

        <TextField control={control} label="Last Name" name="lastName" placeholder="Doe" required />
      </div>

      <SelectField control={control} label="Role" name="role" options={roleOptions} />

      <TextField
        control={control}
        description="Church or organization affiliation"
        label="Ministry"
        name="ministry"
        placeholder="Grace Community Church"
      />

      <TextareaField
        control={control}
        label="Description"
        name="description"
        placeholder="Brief biography..."
        rows={3}
      />

      <UrlField
        control={control}
        label="Profile Image URL"
        name="imageUrl"
        placeholder="https://example.com/image.jpg"
      />

      <UrlField
        control={control}
        label="Website URL"
        name="websiteUrl"
        placeholder="https://example.com"
      />
    </div>
  );
}
