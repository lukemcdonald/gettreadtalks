import type { Route } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

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
    <section className={cn('flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16', className)}>
      <figure className="relative aspect-4/3 w-full overflow-hidden rounded-xl shadow-xl lg:aspect-3/2 lg:w-3/5">
        <Image
          alt={imageAlt}
          className="object-cover"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          src={imageSrc}
        />
      </figure>
      <header className="flex w-full flex-col justify-center space-y-6 lg:w-2/5">
        <div className="lg:-ml-48 relative space-y-4 rounded-xl bg-linear-to-r from-gray-100 to-gray-100 px-2 lg:px-10 lg:py-8">
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
      </header>
    </section>
  );
}
