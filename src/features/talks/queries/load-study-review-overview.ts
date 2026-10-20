'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function loadStudyReviewOverview() {
  const [missing, studies, transcripts] = await Promise.all([
    fetchAuthQuery(api.talks.listTalksWithoutTranscript, {
      status: 'published',
    }),
    fetchAuthQuery(api.talks.listDraftTalkStudies, {}),
    fetchAuthQuery(api.talks.listTalkTranscripts, {}),
  ]);
  const talks = await Promise.all(
    studies.map((study) =>
      fetchAuthQuery(api.talks.getTalk, { id: study.talkId })
    )
  );
  const speakers = await Promise.all(
    talks.map((talk) =>
      talk?.speakerId
        ? fetchAuthQuery(api.speakers.getSpeaker, {
            speakerId: talk.speakerId,
          })
        : null
    )
  );
  const drafts = studies.flatMap((study, index) => {
    const talk = talks[index];

    if (!talk) {
      return [];
    }

    return [{ speaker: speakers[index] ?? null, study, talk }];
  });

  return {
    coverage: {
      blocked: transcripts.filter((item) => item.status === 'blocked').length,
      done: transcripts.filter((item) => item.status === 'done').length,
      failed: transcripts.filter((item) => item.status === 'failed').length,
      missing: missing.length,
    },
    drafts,
  };
}
