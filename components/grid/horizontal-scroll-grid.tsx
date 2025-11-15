'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type HorizontalScrollGridProps = {
  children: React.ReactNode;
  className?: string;
  sidebar: React.ReactNode;
};

export function HorizontalScrollGrid({
  children,
  className,
  sidebar,
}: HorizontalScrollGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) {
      return;
    }

    const scrollAmount = 400;
    const currentScroll = scrollRef.current.scrollLeft;
    const targetScroll =
      direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      behavior: 'smooth',
      left: targetScroll,
    });
  };

  return (
    <div className={cn('container mx-auto px-4 py-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">{sidebar}</div>
          </aside>
          <div className="min-w-0">
            <div className="relative">
              <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4" ref={scrollRef}>
                {children}
              </div>
              <div className="absolute right-0 top-0 flex gap-2">
                <Button
                  className="h-8 rounded-full shadow-md w-8"
                  onClick={() => scroll('left')}
                  size="icon"
                  variant="secondary"
                >
                  ←
                </Button>
                <Button
                  className="h-8 rounded-full shadow-md w-8"
                  onClick={() => scroll('right')}
                  size="icon"
                  variant="secondary"
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
