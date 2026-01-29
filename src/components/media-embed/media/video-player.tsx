interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      {/* biome-ignore lint/a11y/useMediaCaption: Caption files not available for dynamically embedded media */}
      <video className="h-full w-full" controls preload="metadata" src={src}>
        Your browser does not support the video element.
      </video>
    </div>
  );
}
