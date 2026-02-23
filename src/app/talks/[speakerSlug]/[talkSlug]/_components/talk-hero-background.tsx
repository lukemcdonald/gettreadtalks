import Image from 'next/image';

interface TalkHeroBackgroundProps {
  imageSrc: string | null;
}

export function TalkHeroBackground({ imageSrc }: TalkHeroBackgroundProps) {
  if (!imageSrc) {
    return <div className="absolute inset-0 bg-gray-950" />;
  }

  return (
    <div>
      <Image
        alt=""
        className="scale-110 object-cover blur-md grayscale"
        fill
        priority
        sizes="100vw"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-gray-950/85" />
    </div>
  );
}
