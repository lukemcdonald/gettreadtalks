'use client';

import type { Route } from 'next';
import type { ComponentType } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MenuItem } from '@/components/ui/menu';

type AccountMenuItemProps = {
  href?: string;
  icon?: ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
} & Omit<React.ComponentProps<typeof MenuItem>, 'render' | 'children'>;

export function AccountMenuItem({
  href,
  icon: Icon,
  label,
  onClick,
  ...delegated
}: AccountMenuItemProps) {
  const isButton = !href && Boolean(onClick);

  let renderComponent: React.ReactElement<Record<string, unknown>> | undefined;
  if (isButton) {
    renderComponent = <Button size="xs" variant="ghost" />;
  } else if (href) {
    renderComponent = <Link href={href as Route} />;
  }

  return (
    <MenuItem
      className="w-full items-center justify-start"
      render={renderComponent}
      {...delegated}
      nativeButton={isButton}
      onClick={onClick}
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </MenuItem>
  );
}
