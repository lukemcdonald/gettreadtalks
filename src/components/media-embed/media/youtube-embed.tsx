'use client';

import dynamic from 'next/dynamic';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

import { Skeleton } from '@/components/ui/primitives/skeleton';

const LiteYouTubeEmbed = dynamic(() => import('react-lite-youtube-embed').then((m) => m.default), {
  ssr: false,
  loading: () => <Skeleton className="aspect-video w-full" />,
});

interface YouTubeEmbedProps {
  id: string;
  title: string;
}

export function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  return (
    <div className="[&_.lty-playbtn]:rounded-xl [&_.lty-playbtn]:bg-primary/90 [&_.lty-playbtn]:transition-colors hover:[&_.lty-playbtn]:bg-primary">
      <LiteYouTubeEmbed id={id} poster="hqdefault" title={title} wrapperClass="yt-lite" />
    </div>
  );
}
