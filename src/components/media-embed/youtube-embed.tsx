'use client';

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface YouTubeEmbedProps {
  id: string;
  title: string;
}

export function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  return (
    <div className="[&_.lty-playbtn]:rounded-xl [&_.lty-playbtn]:bg-primary/90 [&_.lty-playbtn]:transition-colors hover:[&_.lty-playbtn]:bg-primary">
      <LiteYouTubeEmbed
        id={id}
        poster="hqdefault"
        title={title}
        wrapperClass="yt-lite rounded-lg overflow-hidden"
      />
    </div>
  );
}
