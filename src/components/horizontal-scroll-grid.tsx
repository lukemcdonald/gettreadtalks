'use client';

import { useRef } from 'react';

import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';

type HorizontalScrollGridProps = {
  children: React.ReactNode;
  className?: string;
  sidebar: React.ReactNode;
};

export function HorizontalScrollGrid({ children, sidebar }: HorizontalScrollGridProps) {
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
    <Section variant="xl">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">{sidebar}</div>
          </aside>
          <div className="min-w-0">
            {/* Mobile: Vertical grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">{children}</div>
            {/* Desktop: Horizontal scroll */}
            <div className="relative hidden lg:block">
              <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4" ref={scrollRef}>
                {children}
              </div>
              <div className="absolute top-0 right-0 flex gap-2">
                <Button
                  className="h-8 w-8 rounded-full shadow-md"
                  onClick={() => scroll('left')}
                  size="icon"
                  variant="secondary"
                >
                  ←
                </Button>
                <Button
                  className="h-8 w-8 rounded-full shadow-md"
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
      </Container>
    </Section>
  );
}
