'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button, Fieldset, FormError, TextField } from '@/components/ui';
import { updateProfile } from '@/features/users/actions/update-profile';

interface NameFormValues {
  name: string;
}

interface EmailFormValues {
  email: string;
}

interface ProfileFormProps {
  currentEmail: string;
  currentName: string;
}

function NameForm({ currentName }: { currentName: string }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<NameFormValues>({ defaultValues: { name: currentName } });

  function onSubmit(values: NameFormValues) {
    startTransition(async () => {
      try {
        await updateProfile({ name: values.name });
        toast.success('Name updated');
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

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<EmailFormValues>({ defaultValues: { email: currentEmail } });

  function onSubmit(values: EmailFormValues) {
    startTransition(async () => {
      try {
        await updateProfile({ email: values.email });
        toast.success('Email updated');
      } catch {
        form.setError('root', { message: 'Failed to update email. Please try again.' });
      }
    });
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <FormError error={form.formState.errors.root} />
      <Fieldset disabled={isPending}>
        <TextField control={form.control} label="Email" name="email" required type="email" />
      </Fieldset>
      <div>
        <Button disabled={isPending} size="sm" type="submit">
          Save Email
        </Button>
      </div>
    </form>
  );
}

export function ProfileForm({ currentEmail, currentName }: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <NameForm currentName={currentName} />
      <EmailForm currentEmail={currentEmail} />
    </div>
  );
}
