import Image from 'next/image';

interface SpeakerHeroBackgroundProps {
  imageSrc: string | null;
}

export function SpeakerHeroBackground({ imageSrc }: SpeakerHeroBackgroundProps) {
  if (!imageSrc) {
    return (
      <>
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-950 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.06),transparent_50%)]" />
      </>
    );
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
      {/* Multi-layer overlay for depth and atmosphere */}
      <div className="absolute inset-0 bg-gray-950/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_60%)]" />
      <div className="absolute inset-0 bg-linear-to-t from-gray-950/50 via-transparent to-transparent" />
    </>
  );
}
