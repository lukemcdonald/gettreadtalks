'use client';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@/components/ui';

interface DeleteBlockedDialogProps {
  blockReason: string;
  name: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function DeleteBlockedDialog({
  blockReason,
  name,
  onOpenChange,
  open,
}: DeleteBlockedDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cannot delete &quot;{name}&quot;</AlertDialogTitle>
          <AlertDialogDescription>{blockReason}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" />}>
            Close
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
