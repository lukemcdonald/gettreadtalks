'use client';

import type { ComponentType } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MenuItem } from '@/components/ui/menu';

type AccountMenuItemProps = {
  href?: React.ComponentProps<typeof Link>['href'];
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

  const ButtonComponent = isButton && <Button size="xs" variant="ghost" />;
  const LinkComponent = href && <Link href={href} />;

  return (
    <MenuItem
      className="w-full items-center justify-start"
      render={ButtonComponent || LinkComponent}
      {...delegated}
      nativeButton={isButton}
      onClick={onClick}
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </MenuItem>
  );
}
