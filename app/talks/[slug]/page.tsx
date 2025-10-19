import { fetchQuery } from 'convex/nextjs';
import { notFound } from 'next/navigation';

import MainLayout from '@/components/layout/main-layout';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

interface TalkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TalkPage({ params }: TalkPageProps) {
  const { slug } = await params;
  const authToken = await getAuthToken();

  const talkData = await fetchQuery(api.talks.getBySlug, { slug }, { token: authToken });

  if (!talkData) {
    notFound();
  }

  const { talk, speaker, collection, clips, topics } = talkData;

  return (
    <MainLayout>
      <div>
        <h1 className="text-2xl font-bold">{talk.title}</h1>

        {speaker && (
          <section className="mb-4">
            <h2 className="text-lg font-bold">Speaker</h2>
            <p>
              {speaker.firstName} {speaker.lastName}
            </p>
            {speaker.description && <p>{speaker.description}</p>}
            {speaker.role && (
              <p>
                <strong>Role:</strong> {speaker.role}
              </p>
            )}
            {speaker.ministry && (
              <p>
                <strong>Ministry:</strong> {speaker.ministry}
              </p>
            )}
          </section>
        )}

        {/* Collection */}
        {collection && (
          <section className="mb-4">
            <h2 className="text-lg font-bold">Collection</h2>
            <p>{collection.title}</p>
            {collection.description && <p>{collection.description}</p>}
          </section>
        )}

        {/* Topics */}
        {topics.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-bold">Topics</h2>
            <ul>
              {topics.map((topic) => (
                <li key={topic._id}>{topic.title}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Talk Details */}
        <section className="mb-4">
          <h2 className="text-lg font-bold">Talk Details</h2>
          <p>
            <strong>Status:</strong> {talk.status}
          </p>
          <p>
            <strong>Published:</strong>{' '}
            {talk.publishedAt ? new Date(talk.publishedAt).toLocaleDateString() : 'Not published'}
          </p>
          {talk.featured && (
            <p>
              <strong>Featured Talk</strong>
            </p>
          )}
          {talk.description && <p>{talk.description}</p>}
          {talk.scripture && (
            <div>
              <strong>Scripture:</strong> {talk.scripture}
            </div>
          )}
          {talk.mediaUrl && (
            <div>
              <strong>Media URL:</strong>{' '}
              <a href={talk.mediaUrl} target="_blank" rel="noopener noreferrer">
                {talk.mediaUrl}
              </a>
            </div>
          )}
        </section>

        {/* Clips */}
        {clips.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-bold">Clips ({clips.length})</h2>
            <ul>
              {clips.map((clip) => (
                <li key={clip._id}>
                  <strong>{clip.title}</strong>
                  {clip.description && <p>{clip.description}</p>}
                  <p>
                    <strong>Media:</strong>{' '}
                    <a href={clip.mediaUrl} target="_blank" rel="noopener noreferrer">
                      View Clip
                    </a>
                  </p>
                  <p>
                    <strong>Status:</strong> {clip.status}
                  </p>
                  {clip.publishedAt && (
                    <p>
                      <strong>Published:</strong> {new Date(clip.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
