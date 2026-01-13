'use client';

import type { Route } from 'next';
import type { ComponentType, ReactElement } from 'react';

import Link from 'next/link';

import { Button, MenuItem } from '@/components/ui';

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
  const isButton = !href && !!onClick;

  let renderComponent: ReactElement<Record<string, unknown>> | undefined;
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
      {!!Icon && <Icon className="size-4" />}
      {label}
    </MenuItem>
  );
}
