import type { Route } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type HeroAction = {
  href: string;
  label: string;
};

type HeroSectionProps = {
  className?: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  title: string;
};

export function HeroSection({
  className,
  description,
  imageAlt,
  imageSrc,
  primaryAction,
  secondaryAction,
  title,
}: HeroSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="w-full lg:w-3/5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-xl lg:aspect-[3/2]">
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              src={imageSrc}
            />
          </div>
        </div>
        <div className="flex w-full flex-col justify-center space-y-6 lg:w-2/5">
          <div className="space-y-4">
            <h1 className="font-bold text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed sm:text-lg lg:text-xl">
              {description}
            </p>
          </div>
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col gap-3 sm:flex-row">
              {primaryAction && (
                <Button render={<Link href={primaryAction.href as Route} />} size="lg">
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button
                  render={<Link href={secondaryAction.href as Route} />}
                  size="lg"
                  variant="outline"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
