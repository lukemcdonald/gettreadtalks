import Image from 'next/image';

interface SpeakerHeroBackgroundProps {
  imageSrc: string | null;
}

export function SpeakerHeroBackground({ imageSrc }: SpeakerHeroBackgroundProps) {
  if (!imageSrc) {
    return <div className="absolute inset-0 bg-gray-950" />;
  }

  return (
    <>
      <Image
        alt=""
        className="absolute inset-0 scale-110 object-cover blur-xl saturate-50"
        fill
        priority
        sizes="100vw"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-gray-950/85" />
    </>
  );
}
