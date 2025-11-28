import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils';

const fieldsetVariants = cva('flex flex-col gap-4', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-6',
      lg: 'gap-10',
    },
  },
});

interface FieldsetProps extends useRender.ComponentProps<'fieldset'> {
  size?: VariantProps<typeof fieldsetVariants>['size'];
}

function Fieldset({ className, render, size, ...props }: FieldsetProps) {
  const defaultProps = {
    'data-slot': 'fieldset',
    className: cn(fieldsetVariants({ size }), className),
  };

  return useRender({
    defaultTagName: 'fieldset',
    render,
    props: mergeProps<'fieldset'>(defaultProps, props),
  });
}

export { Fieldset, fieldsetVariants };
