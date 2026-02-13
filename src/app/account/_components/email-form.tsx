'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Fieldset, FormError, TextField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateEmail } from '@/features/users/actions/update-email';

interface EmailFormValues {
  email: string;
}

interface EmailFormProps {
  currentEmail: string;
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<EmailFormValues>({ defaultValues: { email: currentEmail } });

  function onSubmit(values: EmailFormValues) {
    startTransition(async () => {
      try {
        await updateEmail({ newEmail: values.email });
        toastManager.add({ title: 'Email updated', type: 'success' });
      } catch {
        form.setError('root', { message: 'Failed to update email. Please try again.' });
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormError className="mb-3" error={form.formState.errors.root} />
      <Fieldset className="max-w-full" disabled={isPending}>
        <TextField
          control={form.control}
          label="Email address"
          name="email"
          required
          type="email"
        />
      </Fieldset>
      <div className="mt-4">
        <Button disabled={isPending} size="sm" type="submit">
          Save email
        </Button>
      </div>
    </form>
  );
}
