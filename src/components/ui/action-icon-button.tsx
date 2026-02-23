import type { ReactNode } from 'react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';

interface ActionIconButtonProps {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}

export function ActionIconButton({ children, disabled, label, onClick }: ActionIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="rounded-full"
            disabled={disabled}
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
