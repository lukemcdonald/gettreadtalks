import type { Talk } from '@/features/talks/types';

import Link from 'next/link';

interface TalkDetailsProps {
  talk: Talk;
}

export function TalkDetails({ talk }: TalkDetailsProps) {
  return (
    <section className="mb-4">
      <h2 className="font-semibold text-lg">Talk Details</h2>
      <p>
        <strong>Status:</strong> {talk.status}
      </p>
      <p>
        <strong>Published:</strong>{' '}
        {talk.publishedAt ? new Date(talk.publishedAt).toLocaleDateString() : 'Not published'}
      </p>
      {!!talk.featured && (
        <p>
          <strong>Featured Talk</strong>
        </p>
      )}
      {!!talk.description && <p>{talk.description}</p>}
      {!!talk.scripture && (
        <div>
          <strong>Scripture:</strong> {talk.scripture}
        </div>
      )}
      {!!talk.mediaUrl && (
        <div>
          <strong>Media URL:</strong>{' '}
          <Link href={talk.mediaUrl} rel="noopener noreferrer" target="_blank">
            {talk.mediaUrl}
          </Link>
        </div>
      )}
    </section>
  );
}
