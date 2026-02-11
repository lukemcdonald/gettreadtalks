'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Fieldset, FormError, TextField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateProfile } from '@/features/users/actions/update-profile';

interface NameFormValues {
  name: string;
}

interface ProfileFormProps {
  currentName: string;
}

export function ProfileForm({ currentName }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<NameFormValues>({ defaultValues: { name: currentName } });

  function onSubmit(values: NameFormValues) {
    startTransition(async () => {
      try {
        await updateProfile({ name: values.name });
        toastManager.add({ title: 'Name updated', type: 'success' });
      } catch {
        form.setError('root', { message: 'Failed to update name. Please try again.' });
      }
    });
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FormError error={form.formState.errors.root} />
      <Fieldset disabled={isPending}>
        <TextField control={form.control} label="Name" name="name" required />
      </Fieldset>
      <div>
        <Button disabled={isPending} size="sm" type="submit">
          Save Name
        </Button>
      </div>
    </form>
  );
}
