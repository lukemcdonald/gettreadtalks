import Image from 'next/image';

import { cn } from '@/utils';

interface HeroBackgroundProps {
  className?: string;
  imageSrc: string | null;
  overlay?: string;
}

export function HeroBackground({
  className,
  imageSrc,
  overlay = 'bg-gray-950/85',
}: HeroBackgroundProps) {
  if (!imageSrc) {
    return <div className="absolute inset-0 bg-gray-950" />;
  }

  return (
    <div>
      <Image
        alt=""
        className={cn('scale-110 object-cover', className)}
        fill
        priority
        sizes="100vw"
        src={imageSrc}
      />
      <div className={cn('absolute inset-0', overlay)} />
    </div>
  );
}
