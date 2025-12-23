type ClipsListProps = {
  clips: Array<{
    _id: string;
    title: string;
    description?: string;
    mediaUrl: string;
    status: string;
    publishedAt?: number;
  }>;
};

export function ClipsList({ clips }: ClipsListProps) {
  return (
    <section className="mb-4">
      <h2 className="font-semibold text-lg">Clips ({clips.length})</h2>
      <ul>
        {clips.map((clip) => (
          <li key={clip._id}>
            <strong>{clip.title}</strong>
            {!!clip.description && <p>{clip.description}</p>}
            <p>
              <strong>Media:</strong>{' '}
              <a href={clip.mediaUrl} rel="noopener noreferrer" target="_blank">
                View Clip
              </a>
            </p>
            <p>
              <strong>Status:</strong> {clip.status}
            </p>
            {!!clip.publishedAt && (
              <p>
                <strong>Published:</strong> {new Date(clip.publishedAt).toLocaleDateString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
