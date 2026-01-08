'use client';

import type { ActionsGroupProps } from './actions-group.types';

import { Fragment } from 'react';
import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';

import { Button, Group, GroupSeparator } from '@/components/ui';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/primitives/menu';

export function ActionsGroup({ disabled, menuItems, primaryAction }: ActionsGroupProps) {
  const visibleItems = menuItems.filter((item) => !item.hidden);
  const hasItems = visibleItems.length > 0;

  if (!(hasItems || primaryAction)) {
    return null;
  }

  return (
    <Group aria-label="Actions group">
      {!!primaryAction && (
        <Button
          disabled={disabled || primaryAction.disabled || primaryAction.loading}
          onClick={primaryAction.onClick}
          render={primaryAction.href ? <Link href={primaryAction.href} /> : undefined}
          type={primaryAction.type}
        >
          {primaryAction.loading
            ? primaryAction.loadingLabel || primaryAction.label
            : primaryAction.label}
        </Button>
      )}

      {!!hasItems && !!primaryAction && <GroupSeparator className="bg-primary/72" />}

      {!!hasItems && (
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
