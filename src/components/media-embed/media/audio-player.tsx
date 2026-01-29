interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      {/* biome-ignore lint/a11y/useMediaCaption: Caption files not available for dynamically embedded media */}
      <audio className="w-full" controls preload="metadata" src={src}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
