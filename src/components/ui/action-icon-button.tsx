import type { ReactNode } from 'react';

import { Button } from './primitives/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip';

interface ActionIconButtonProps {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onClick: () => void;
}

export function ActionIconButton({
  children,
  disabled,
  label,
  loading,
  onClick,
}: ActionIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="rounded-full"
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
