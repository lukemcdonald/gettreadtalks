'use client';

import type { ButtonProps } from '@/components/ui';
import type { ReactNode } from 'react';

import { SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { useSearchHotkeyLabel } from '@/features/search/hooks/use-header-search';
import { cn } from '@/utils';

export function SearchHotkeyLabel() {
  const hotkey = useSearchHotkeyLabel();

  return <span className="text-muted-foreground text-xs">{hotkey}</span>;
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
