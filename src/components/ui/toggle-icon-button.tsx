import type { LucideIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';

interface ToggleIconButtonProps {
  activeLabel: string;
  disabled?: boolean;
  icon: LucideIcon;
  inactiveLabel: string;
  isActive: boolean;
  onToggle: () => void;
}

export function ToggleIconButton({
  activeLabel,
  disabled,
  icon: Icon,
  inactiveLabel,
  isActive,
  onToggle,
}: ToggleIconButtonProps) {
  return (
    <ActionIconButton
      disabled={disabled}
      label={isActive ? activeLabel : inactiveLabel}
      onClick={onToggle}
    >
      <Icon className={isActive ? 'fill-current' : undefined} strokeWidth={2.5} />
    </ActionIconButton>
  );
}
