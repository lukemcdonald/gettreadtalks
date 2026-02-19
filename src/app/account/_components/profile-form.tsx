'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';

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
  const router = useRouter();
  const form = useForm<NameFormValues>({
    defaultValues: {
      name: currentName,
    },
  });

  const watchedName = useWatch({ control: form.control, name: 'name' });
  const hasChanged = watchedName !== currentName;

  function onSubmit(values: NameFormValues) {
    startTransition(async () => {
      try {
        await updateProfile({ name: values.name });
        toastManager.add({
          title: 'Name updated',
          type: 'success',
        });
        router.refresh();
      } catch {
        form.setError('root', {
          message: 'Failed to update name. Please try again.',
        });
      }
    });
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FormError error={form.formState.errors.root} />
      <Fieldset className="max-w-full" disabled={isPending}>
        <TextField control={form.control} label="Name" name="name" required />
      </Fieldset>
      {hasChanged && (
        <div>
          <Button disabled={isPending} size="sm" type="submit">
            Save name
          </Button>
        </div>
      )}
    </form>
  );
}
