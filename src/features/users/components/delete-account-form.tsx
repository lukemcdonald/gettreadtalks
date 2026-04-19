'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

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
import { toastManager } from '@/components/ui/primitives/toast';
import { deleteAccount } from '@/features/users/actions/delete-account';
import { captureException } from '@/services/errors/client';

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
        toastManager.add({ title: 'Account deleted', type: 'success' });
      } catch (err) {
        captureException(err);
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

        <form className="px-6 pb-4" id="delete-account-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FormError error={form.formState.errors.root} />
          <Fieldset className="flex w-full flex-col gap-6" disabled={isPending}>
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
          <Button
            form="delete-account-form"
            loading={isPending}
            type="submit"
            variant="destructive"
          >
            Delete Account
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
