'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Fieldset,
  FormError,
  TextField,
} from '@/components/ui';
import { deleteAccount } from '@/features/users/actions/delete-account';

interface DeleteFormValues {
  password: string;
}

export function DeleteAccountForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<DeleteFormValues>({ defaultValues: { password: '' } });

  function onSubmit(values: DeleteFormValues) {
    startTransition(async () => {
      try {
        await deleteAccount({ password: values.password });
        toast.success('Account deleted');
      } catch {
        form.setError('root', {
          message: 'Failed to delete account. Check your password and try again.',
        });
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="sm" variant="destructive-outline" />}>
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your account and all associated data will be permanently
            deleted. Enter your password to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form className="px-6 pb-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormError error={form.formState.errors.root} />
          <Fieldset disabled={isPending}>
            <TextField
              control={form.control}
              label="Password"
              name="password"
              required
              type="password"
            />
          </Fieldset>
        </form>

        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" />}>Cancel</AlertDialogClose>
          <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)} variant="destructive">
            Delete Account
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
