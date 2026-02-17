'use client';

import type { ReactNode } from 'react';

import { SlidersHorizontalIcon } from 'lucide-react';

import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import {
  Sheet,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/primitives/sheet';
import { useActiveFilterCount } from '@/hooks/use-active-filter-count';
import { cn } from '@/utils';

interface MobileFilterSheetProps {
  children: ReactNode;
  iconOnly?: boolean;
  label?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showCount?: boolean;
  title?: string;
}

export function MobileFilterSheet({
  children,
  iconOnly = false,
  label = 'Filters',
  onOpenChange,
  open,
  showCount = true,
  title,
}: MobileFilterSheetProps) {
  const count = useActiveFilterCount();
  const sheetTitle = title ?? label;
  const isControlled = open !== undefined;

  return (
    <Sheet onOpenChange={onOpenChange} open={isControlled ? open : undefined}>
      <SheetTrigger
        className={cn(!iconOnly && 'w-full')}
        render={<Button size={iconOnly ? 'icon-lg' : 'sm'} variant="outline" />}
      >
        <SlidersHorizontalIcon />
        {!iconOnly && label}
        {showCount &&
          count > 0 &&
          (iconOnly ? (
            <span className="absolute -top-1.5 -right-1.5 flex size-[18px] items-center justify-center rounded-full bg-primary font-semibold text-[10px] text-primary-foreground">
              {count}
            </span>
          ) : (
            <Badge size="sm" variant="secondary">
              {count}
            </Badge>
          ))}
      </SheetTrigger>
      <SheetPopup side="bottom">
        <SheetHeader>
          <SheetTitle>{sheetTitle}</SheetTitle>
        </SheetHeader>
        <SheetPanel>
          <div className="flex flex-col gap-4 pb-2">{children}</div>
        </SheetPanel>
      </SheetPopup>
    </Sheet>
  );
}
