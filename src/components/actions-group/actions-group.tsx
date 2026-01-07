'use client';

import type { ReactNode } from 'react';

import { EllipsisIcon } from 'lucide-react';

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
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
  hidden?: boolean;
  separator?: boolean;
};

export type ActionsGroupProps = {
  primaryAction?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
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
        <Button disabled={disabled || primaryAction.disabled} onClick={primaryAction.onClick}>
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
              <div key={item.label}>
                {!!item.separator && <MenuSeparator />}
                <MenuItem disabled={item.disabled} onClick={item.onClick} variant={item.variant}>
                  {item.icon}
                  {item.label}
                </MenuItem>
              </div>
            ))}
          </MenuPopup>
        </Menu>
      )}
    </Group>
  );
}
