'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '@/utils';
import { ScrollBar } from '../primitives/scroll-area';

/**
 * Custom ScrollArea component with allowPageScroll support.
 *
 * When allowPageScroll is true, vertical scrolling propagates to the page
 * instead of being contained within the scroll area. Useful for horizontal
 * carousels that shouldn't block vertical page scroll.
 *
 * NOTE: This is a copy of the Coss UI primitive with allowPageScroll added.
 * Submit PR to Coss UI to add this prop. Once merged, delete this file and
 * use the primitive directly.
 *
 * Implementation: Conditionally applies overscroll-contain to allow scroll chaining.
 */
function ScrollArea({
  allowPageScroll = false,
  className,
  children,
  scrollFade = false,
  scrollbarGutter = false,
  ...delegated
}: ScrollAreaPrimitive.Root.Props & {
  allowPageScroll?: boolean;
  scrollFade?: boolean;
  scrollbarGutter?: boolean;
}) {
  return (
    <ScrollAreaPrimitive.Root className={cn('size-full min-h-0', className)} {...delegated}>
      <ScrollAreaPrimitive.Viewport
        className={cn(
          'h-full rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-has-overflow-x:overscroll-x-contain',
          !allowPageScroll && 'overscroll-contain',
          scrollFade &&
            'mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]',
          scrollbarGutter && 'data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5',
        )}
        data-slot="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea };
