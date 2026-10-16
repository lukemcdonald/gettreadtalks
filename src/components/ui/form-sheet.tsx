'use client';

import type { FormEventHandler, ReactNode } from 'react';
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';

import { useMediaQuery } from '@/hooks/use-media-query';

import { FormError } from './form/form-error';
import { Button } from './primitives/button';
import {
  Drawer,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from './primitives/drawer';
import { Skeleton } from './primitives/skeleton';

export interface FormSheetProps {
  children: ReactNode;
  error?: FieldError | FieldError[] | FieldErrors<FieldValues>['root'];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  open: boolean;
  submitLabel: string;
  title: string;
}

interface FormSheetLoadingProps {
  children: ReactNode;
  loading: true;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

function ignoreOpenChange(_open: boolean) {}

function isLoadingProps(
  props: FormSheetLoadingProps | FormSheetProps
): props is FormSheetLoadingProps {
  return 'loading' in props;
}

export function FormSheet(props: FormSheetLoadingProps | FormSheetProps) {
  const isDesktop = useMediaQuery('lg');
  const isLoading = isLoadingProps(props);
  const onOpenChange = props.onOpenChange ?? ignoreOpenChange;
  const open = props.open ?? true;

  const footer = isLoading ? (
    <>
      <Skeleton className="h-9 w-20 rounded-lg sm:h-8" />
      <Skeleton className="h-9 w-24 rounded-lg sm:h-8" />
    </>
  ) : (
    <>
      <Button
        disabled={props.isPending}
        onClick={() => {
          onOpenChange(false);
        }}
        type="button"
        variant="outline"
      >
        Cancel
      </Button>
      <Button loading={props.isPending} type="submit">
        {props.submitLabel}
      </Button>
    </>
  );

  const panel = isLoading ? (
    props.children
  ) : (
    <>
      <FormError error={props.error} />
      {props.children}
    </>
  );

  const panelAndFooter = (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <DrawerPanel>{panel}</DrawerPanel>
      </div>

      <DrawerFooter className="overflow-hidden">{footer}</DrawerFooter>
    </>
  );

  return (
    <Drawer
      onOpenChange={onOpenChange}
      open={open}
      position={isDesktop ? 'right' : 'bottom'}
    >
      <DrawerPopup
        className="has-data-[slot=drawer-bar]:ps-0 has-data-[slot=drawer-bar]:pt-0"
        showBar
        showCloseButton
        variant="default"
      >
        <DrawerHeader>
          <DrawerTitle>
            {isLoading ? (
              <>
                <span className="sr-only">Loading</span>
                <Skeleton aria-hidden className="h-5 w-40" />
              </>
            ) : (
              props.title
            )}
          </DrawerTitle>
        </DrawerHeader>

        {isLoading ? (
          panelAndFooter
        ) : (
          <form className="contents" onSubmit={props.onSubmit}>
            {panelAndFooter}
          </form>
        )}
      </DrawerPopup>
    </Drawer>
  );
}
