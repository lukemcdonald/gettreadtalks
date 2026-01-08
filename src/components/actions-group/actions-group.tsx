'use client';

import type { ActionsGroupMenuItem, ActionsGroupProps } from './actions-group.types';

import { Fragment } from 'react';
import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/primitives/menu';

export function ActionsGroup({ primaryAction, menuItems, disabled }: ActionsGroupProps) {
  const visibleItems = menuItems.filter((item) => !item.hidden);

  if (visibleItems.length === 0 && !primaryAction) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {!!primaryAction && (
        <Button
          disabled={disabled || primaryAction.disabled}
          onClick={primaryAction.onClick}
          render={primaryAction.href ? <Link href={primaryAction.href} /> : undefined}
          type={primaryAction.type}
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
    </div>
  );
}
