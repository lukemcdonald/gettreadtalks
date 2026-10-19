'use client';

import dynamic from 'next/dynamic';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

const LiteYouTubeEmbed = dynamic(
  () => import('react-lite-youtube-embed').then((m) => m.default),
  {
    ssr: false,
  }
);

interface YouTubeEmbedProps {
  id: string;
  title: string;
}

export function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  const posterUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <div className="[&_.lty-playbtn]:bg-primary/90 hover:[&_.lty-playbtn]:bg-primary yt-lite relative size-full [&_.lty-playbtn]:rounded-xl [&_.lty-playbtn]:transition-colors">
      {/* oxlint-disable-next-line next/no-img-element -- LCP poster must ship as a static img, not the optimizer */}
      <img
        alt=""
        className="lty-thumbnail"
        fetchPriority="high"
        height={360}
        src={posterUrl}
        width={480}
      />
      <span aria-hidden className="lty-playbtn pointer-events-none" />
      <div className="absolute inset-0 z-10">
        <LiteYouTubeEmbed
          id={id}
          poster="hqdefault"
          thumbnail={posterUrl}
          title={title}
          wrapperClass="yt-lite size-full"
        />
      </div>
    </div>
  );
}
