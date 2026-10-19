'use client';

import type { ButtonProps } from '@/components/ui';
import type { ReactNode } from 'react';

import { SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { useSearchHotkeyLabel } from '@/features/search/hooks/use-header-search';
import { formatSearchHotkeyLabel } from '@/features/search/utils';
import { cn } from '@/utils';

export function SearchHotkeyLabelText({ children }: { children: string }) {
  return (
    <span className="text-muted-foreground inline-grid text-xs">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {formatSearchHotkeyLabel()}
      </span>
      <span className="col-start-1 row-start-1">{children}</span>
    </span>
  );
}

export function SearchHotkeyLabel() {
  const hotkey = useSearchHotkeyLabel();

  return <SearchHotkeyLabelText>{hotkey}</SearchHotkeyLabelText>;
}

export function HeaderSearchDesktopTrigger({
  className,
  hotkey,
  ...delegated
}: ButtonProps & { hotkey: ReactNode }) {
  return (
    <Button
      aria-keyshortcuts="Control+K Meta+K"
      className={cn('rounded-full bg-transparent', className)}
      data-testid="search-cta"
      size="sm"
      variant="outline"
      {...delegated}
    >
      <span className="sr-only">Search</span>
      <SearchIcon aria-hidden="true" />
      {hotkey}
    </Button>
  );
}

export function HeaderSearchMobileTrigger({
  className,
  ...delegated
}: ButtonProps) {
  return (
    <Button
      aria-keyshortcuts="Control+K Meta+K"
      aria-label="Search"
      className={className}
      data-testid="search-cta"
      size="icon-lg"
      variant="ghost"
      {...delegated}
    >
      <SearchIcon className="size-6" />
    </Button>
  );
}
