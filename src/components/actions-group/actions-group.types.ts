import type { ReactNode } from 'react';

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
