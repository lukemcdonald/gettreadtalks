'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';

import { Button, Fieldset, FormError, TextField } from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { updateEmail } from '@/features/users/actions/update-email';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailFormValues {
  email: string;
}

interface EmailFormProps {
  currentEmail: string;
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<EmailFormValues>({ defaultValues: { email: currentEmail } });
  const router = useRouter();

  const watchedEmail = useWatch({ control: form.control, name: 'email' });
  const hasChanged = watchedEmail !== currentEmail;

  function onSubmit(values: EmailFormValues) {
    startTransition(async () => {
      try {
        await updateEmail({ newEmail: values.email });
        toastManager.add({ title: 'Email updated', type: 'success' });
        router.refresh();
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
          rules={{
            pattern: {
              message: 'Please enter a valid email address.',
              value: EMAIL_PATTERN,
            },
            required: 'Email address is required.',
          }}
          type="email"
        />
      </Fieldset>
      {hasChanged && (
        <div className="mt-4">
          <Button disabled={isPending} size="sm" type="submit">
            Update email
          </Button>
        </div>
      )}
    </form>
  );
}
