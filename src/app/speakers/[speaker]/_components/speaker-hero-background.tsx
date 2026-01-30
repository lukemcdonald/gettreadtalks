import Image from 'next/image';

interface SpeakerHeroBackgroundProps {
  imageSrc: string | null;
}

export function SpeakerHeroBackground({ imageSrc }: SpeakerHeroBackgroundProps) {
  if (!imageSrc) {
    return (
      <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
    );
  }

  return (
    <>
      <Image
        alt=""
        className="absolute inset-0 scale-105 object-cover blur-lg"
        fill
        priority
        sizes="100vw"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-gray-950/90 dark:bg-gray-950/90" />
    </>
  );
}
