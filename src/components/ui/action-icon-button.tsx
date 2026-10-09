import type { ReactNode } from 'react';

import { Button } from './primitives/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip';

interface ActionIconButtonProps {
  children: ReactNode;
  'data-testid'?: string;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onClick: () => void;
  pressed?: boolean;
}

export function ActionIconButton({
  children,
  'data-testid': testId,
  disabled,
  label,
  loading,
  onClick,
  pressed,
}: ActionIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            aria-pressed={pressed}
            className="rounded-full"
            data-testid={testId}
            disabled={disabled}
            loading={loading}
            onClick={onClick}
            size="icon"
            variant="secondary"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
