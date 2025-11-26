import type * as React from 'react';

import { mergeProps } from '@base-ui-components/react/merge-props';
import { useRender } from '@base-ui-components/react/use-render';
import { cva } from 'class-variance-authority';
import Link from 'next/link';

import { cn } from '@/utils';

interface CardProps extends useRender.ComponentProps<'div'> {
  variant?: 'default' | 'interactive';
}

const cardVariants = cva(
  'relative flex flex-col gap-6 rounded-lg bg-card bg-clip-padding text-card-foreground before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:border before:border-border-foreground',
  {
    variants: {
      variant: {
        default: '',
        interactive:
          'hover:before:-inset-0.25 isolate ring-1 ring-transparent transition duration-300 hover:shadow-md/3 hover:ring-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Card({ className, render, variant, ...props }: CardProps) {
  const defaultProps = {
    'data-slot': 'card',
    className: cn(cardVariants({ variant }), className),
  };

  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, props),
  });
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 last:pb-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('font-semibold text-lg', className)} data-slot="card-title" {...props} />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      data-slot="card-action"
      {...props}
    />
  );
}

function CardPanel({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-6 pb-6', className)} data-slot="card-content" {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

function CardLink({ children, ...delegated }: React.ComponentProps<typeof Link>) {
  return (
    <Link {...delegated}>
      <span className="absolute inset-0 z-10" />
      {children}
    </Link>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardPanel,
  CardPanel as CardContent,
  CardLink,
};
