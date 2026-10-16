'use client';

import dynamic from 'next/dynamic';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

import { Skeleton } from '@/components/ui';

const LiteYouTubeEmbed = dynamic(
  () => import('react-lite-youtube-embed').then((m) => m.default),
  {
    loading: () => <Skeleton className="size-full rounded-none" />,
    ssr: false,
  }
);

interface YouTubeEmbedProps {
  id: string;
  title: string;
}

export function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  return (
    <div className="[&_.lty-playbtn]:bg-primary/90 hover:[&_.lty-playbtn]:bg-primary size-full [&_.lty-playbtn]:rounded-xl [&_.lty-playbtn]:transition-colors">
      <LiteYouTubeEmbed
        id={id}
        poster="hqdefault"
        title={title}
        wrapperClass="yt-lite"
      />
    </div>
  );
}
