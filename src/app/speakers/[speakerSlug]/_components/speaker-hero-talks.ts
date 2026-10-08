import { isVideoMediaType } from '../../../../components/media-embed/utils.ts';

interface TalkForHero {
  _id: string;
  featured?: boolean;
  mediaUrl?: string;
}

export function featuredHeroCandidates<T extends TalkForHero>(talks: T[]) {
  const featuredVideos = talks.filter(
    (talk) => talk.featured && isVideoMediaType(talk.mediaUrl)
  );

  if (featuredVideos.length > 0) {
    return featuredVideos;
  }

  return talks.filter((talk) => isVideoMediaType(talk.mediaUrl));
}

export function speakerTalkLayout<T extends TalkForHero>(
  talks: T[],
  featuredTalk: T | undefined
) {
  if (!featuredTalk || !isVideoMediaType(featuredTalk.mediaUrl)) {
    return { featuredTalk: undefined, remainingTalks: talks };
  }

  return {
    featuredTalk,
    remainingTalks:
      talks.length > 1
        ? talks.filter((talk) => talk._id !== featuredTalk._id)
        : talks,
  };
}
