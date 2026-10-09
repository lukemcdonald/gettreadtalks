import type { LucideIcon } from 'lucide-react';

import { ActionIconButton } from './action-icon-button';

interface ToggleIconButtonProps {
  activeLabel: string;
  'data-testid'?: string;
  disabled?: boolean;
  icon: LucideIcon;
  inactiveLabel: string;
  isActive: boolean;
  loading?: boolean;
  onToggle: () => void;
}

export function ToggleIconButton({
  activeLabel,
  'data-testid': testId,
  disabled,
  icon: Icon,
  inactiveLabel,
  isActive,
  loading,
  onToggle,
}: ToggleIconButtonProps) {
  return (
    <ActionIconButton
      data-testid={testId}
      disabled={disabled}
      label={isActive ? activeLabel : inactiveLabel}
      loading={loading}
      onClick={onToggle}
      pressed={isActive}
    >
      <Icon
        className={isActive ? 'fill-current' : undefined}
        strokeWidth={2.5}
      />
    </ActionIconButton>
  );
}
