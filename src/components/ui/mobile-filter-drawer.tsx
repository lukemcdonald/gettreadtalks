'use client';

import type { ReactNode } from 'react';

import { SlidersHorizontalIcon } from 'lucide-react';

import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import {
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/primitives/drawer';
import { useActiveFilterCount } from '@/hooks';

interface MobileFilterDrawerProps {
  children: ReactNode;
  label?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  showCount?: boolean;
  title?: string;
  variant?: 'default' | 'icon';
}

interface FilterCountBadgeProps {
  count: number;
  isIcon: boolean;
}

interface FilterTriggerProps {
  count: number;
  label: string;
  showCount: boolean;
}

function FilterCountBadge({ count, isIcon }: FilterCountBadgeProps) {
  if (isIcon) {
    return (
      <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-[18px] items-center justify-center rounded-full text-[10px] font-semibold">
        {count}
      </span>
    );
  }

  return (
    <Badge size="sm" variant="secondary">
      {count}
    </Badge>
  );
}

function IconFilterTrigger({ count, label, showCount }: FilterTriggerProps) {
  return (
    <DrawerTrigger
      render={<Button aria-label={label} size="icon-lg" variant="outline" />}
    >
      <SlidersHorizontalIcon />
      {showCount && count > 0 && <FilterCountBadge count={count} isIcon />}
    </DrawerTrigger>
  );
}

function DefaultFilterTrigger({ count, label, showCount }: FilterTriggerProps) {
  return (
    <DrawerTrigger
      className="w-full"
      render={<Button size="sm" variant="outline" />}
    >
      <SlidersHorizontalIcon />
      {label}
      {showCount && count > 0 && (
        <FilterCountBadge count={count} isIcon={false} />
      )}
    </DrawerTrigger>
  );
}

export function MobileFilterDrawer({
  children,
  label = 'Filters',
  onOpenChange,
  open,
  showCount = true,
  title,
  variant = 'default',
}: MobileFilterDrawerProps) {
  const count = useActiveFilterCount();
  const FilterTrigger =
    variant === 'icon' ? IconFilterTrigger : DefaultFilterTrigger;

  return (
    <Drawer onOpenChange={onOpenChange} open={open} position="bottom">
      <FilterTrigger count={count} label={label} showCount={showCount} />
      <DrawerPopup showBar variant="default">
        <DrawerHeader>
          <DrawerTitle>{title ?? label}</DrawerTitle>
        </DrawerHeader>
        <DrawerPanel>
          <div className="flex flex-col gap-4 pb-2">{children}</div>
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  );
}
