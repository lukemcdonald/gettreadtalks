import { Separator as SeparatorPrimitive } from '@base-ui-components/react/separator';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px self-stretch',
    },
  },
});

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      className={cn(separatorVariants({ orientation }), className)}
      data-slot="separator"
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
