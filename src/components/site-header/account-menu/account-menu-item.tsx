'use client';

import type { Route } from 'next';
import type { ComponentProps, ComponentType, ReactElement, SVGProps } from 'react';

import Link from 'next/link';

import { Button, MenuItem } from '@/components/ui';

type AccountMenuItemProps = {
  href?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
} & Omit<ComponentProps<typeof MenuItem>, 'render' | 'children'>;

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
      className="min-h-10 w-full items-center justify-start px-3 py-2"
      render={renderComponent}
      {...delegated}
      nativeButton={isButton}
      onClick={onClick}
    >
      {!!Icon && <Icon className="size-5" />}
      {label}
    </MenuItem>
  );
}
