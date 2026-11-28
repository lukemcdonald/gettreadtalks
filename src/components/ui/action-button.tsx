import type { LucideIcon } from 'lucide-react';

import { Button } from './primitives/button';

interface ActionButtonProps {
  'data-testid'?: string;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  loading?: boolean;
  onClick: () => void;
  pressed?: boolean;
}

/** Labeled sidebar action; a pressed toggle fills its icon. */
export function ActionButton({
  'data-testid': testId,
  disabled,
  icon: Icon,
  label,
  loading,
  onClick,
  pressed,
}: ActionButtonProps) {
  return (
    <Button
      aria-pressed={pressed}
      data-testid={testId}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      size="sm"
      variant="outline"
    >
      <Icon
        className={pressed ? 'fill-current' : undefined}
        strokeWidth={2.5}
      />
      {label}
    </Button>
  );
}
