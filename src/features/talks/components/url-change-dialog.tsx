'use client';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  Button,
} from '@/components/ui';

interface UrlChangeDialogProps {
  newUrl: string;
  oldUrl: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function UrlChangeDialog({
  newUrl,
  oldUrl,
  onConfirm,
  onOpenChange,
  open,
}: UrlChangeDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>This will change the talk URL</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="mt-2 block space-y-1 text-sm">
              <span className="block">
                <span className="text-muted-foreground">From:</span>{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{oldUrl}</code>
              </span>
              <span className="block">
                <span className="text-muted-foreground">To:</span>{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{newUrl}</code>
              </span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" />}>Cancel</AlertDialogClose>
          <AlertDialogClose onClick={onConfirm} render={<Button />}>
            Save Anyway
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
