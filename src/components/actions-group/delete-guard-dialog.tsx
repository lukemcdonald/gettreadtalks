'use client';

import { Button } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/primitives/alert-dialog';

interface DeleteGuardDialogProps {
  blockReason: string;
  count: number;
  isDeleting: boolean;
  name: string;
  onDelete: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function DeleteGuardDialog({
  blockReason,
  count,
  isDeleting,
  name,
  onDelete,
  onOpenChange,
  open,
}: DeleteGuardDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        {count > 0 ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Cannot delete &quot;{name}&quot;</AlertDialogTitle>
              <AlertDialogDescription>{blockReason}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="outline" />}>Close</AlertDialogClose>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete &quot;{name}&quot;?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="outline" />}>Cancel</AlertDialogClose>
              <Button disabled={isDeleting} onClick={onDelete} variant="destructive">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
