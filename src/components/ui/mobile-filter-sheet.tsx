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
  label?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showCount?: boolean;
  title?: string;
  variant?: 'default' | 'icon';
}

export function MobileFilterSheet({
  children,
  label = 'Filters',
  onOpenChange,
  open,
  showCount = true,
  title,
  variant = 'default',
}: MobileFilterSheetProps) {
  const count = useActiveFilterCount();
  const sheetTitle = title ?? label;
  const isControlled = open !== undefined;
  const isIcon = variant === 'icon';

  return (
    <Sheet onOpenChange={onOpenChange} open={isControlled ? open : undefined}>
      <SheetTrigger
        className={cn(!isIcon && 'w-full')}
        render={<Button size={isIcon ? 'icon-lg' : 'sm'} variant="outline" />}
      >
        <SlidersHorizontalIcon />
        {!isIcon && label}
        {showCount &&
          count > 0 &&
          (isIcon ? (
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
