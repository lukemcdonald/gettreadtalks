'use client';

import type { ReactNode } from 'react';

import { Fragment } from 'react';
import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { Group } from '@/components/ui/primitives/group';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/primitives/menu';

export type ActionsGroupMenuItem = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  hidden?: boolean;
  separator?: boolean;
};

export type ActionsGroupProps = {
  primaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    type?: 'button' | 'submit';
  };
  menuItems: ActionsGroupMenuItem[];
  disabled?: boolean;
};

export function ActionsGroup({ primaryAction, menuItems, disabled }: ActionsGroupProps) {
  const visibleItems = menuItems.filter((item) => !item.hidden);

  if (visibleItems.length === 0 && !primaryAction) {
    return null;
  }

  return (
    <Group aria-label="Actions">
      {!!primaryAction && (
        <Button
          className="hidden md:inline-flex"
          disabled={disabled || primaryAction.disabled}
          onClick={primaryAction.onClick}
          render={primaryAction.href ? <Link href={primaryAction.href} /> : undefined}
          type={primaryAction.type || 'button'}
        >
          {primaryAction.icon}
          {primaryAction.label}
        </Button>
      )}

      {visibleItems.length > 0 && (
        <Menu>
          <MenuTrigger
            render={<Button aria-label="More actions" disabled={disabled} size="icon" />}
          >
            <EllipsisIcon className="size-4" />
          </MenuTrigger>
          <MenuPopup align="end">
            {visibleItems.map((item) => (
              <Fragment key={item.label}>
                {!!item.separator && <MenuSeparator />}
                <MenuItem
                  className="w-full"
                  disabled={item.disabled}
                  nativeButton={!item.href}
                  onClick={item.onClick}
                  render={item.href ? <Link href={item.href} /> : <button type="button" />}
                  variant={item.variant}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              </Fragment>
            ))}
          </MenuPopup>
        </Menu>
      )}
    </Group>
  );
}
