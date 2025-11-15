import Image from 'next/image';

import { cn } from '@/lib/utils';

type HeroSectionProps = {
  className?: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

export function HeroSection({
  className,
  description,
  imageAlt,
  imageSrc,
  title,
}: HeroSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-1">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-[3/2]">
            <Image alt={imageAlt} className="object-cover" fill priority src={imageSrc} />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center space-y-4">
          <h1 className="font-bold text-4xl tracking-tight">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  );
}
