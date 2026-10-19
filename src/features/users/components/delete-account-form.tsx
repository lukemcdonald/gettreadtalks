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
  PasswordField,
} from '@/components/ui';
import { toastManager } from '@/components/ui/primitives/toast';
import { deleteAccount } from '@/features/users/actions/delete-account';
import { setServerErrors } from '@/lib/forms/react-hook-form';
import { captureException, formatErrorMessage } from '@/services/errors';

interface DeleteFormValues {
  password: string;
}

export function DeleteAccountForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<DeleteFormValues>({ defaultValues: { password: '' } });

  function onSubmit(values: DeleteFormValues) {
    startTransition(async () => {
      try {
        const result = await deleteAccount({ password: values.password });

        if (!result.success) {
          setServerErrors(form.setError, result.errors);
          return;
        }

        toastManager.add({ title: 'Account deleted', type: 'success' });
        window.location.assign('/');
      } catch (error) {
        captureException(error, { fingerprint: ['auth', 'deleteAccount'] });
        form.setError('root', {
          message: formatErrorMessage(error),
        });
      }
    });
  }

  return (
    <AlertDialog
      onOpenChangeComplete={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <AlertDialogTrigger
        render={<Button size="sm" variant="destructive-outline" />}
      >
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your account and all associated data
            will be permanently deleted. Enter your password to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          className="px-6 pb-4"
          id="delete-account-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Fieldset disabled={isPending}>
            <FormError error={form.formState.errors.root} />
            <PasswordField
              control={form.control}
              label="Password"
              name="password"
              required
            />
          </Fieldset>
        </form>

        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" />}>
            Cancel
          </AlertDialogClose>
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
