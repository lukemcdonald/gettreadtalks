export const SEARCH_RESULT_TYPES = [
  'talk',
  'speaker',
  'topic',
  'clip',
] as const;

export type SearchResultType = (typeof SEARCH_RESULT_TYPES)[number];

export interface SearchHit {
  href: string;
  id: string;
  subtitle?: string;
  title: string;
  type: SearchResultType;
}

export interface SearchSpeaker {
  firstName: string;
  lastName: string;
  slug: string;
}

export interface SiteSearchResult {
  clips: {
    _id: string;
    description?: string;
    slug: string;
    speaker: SearchSpeaker | null;
    title: string;
  }[];
  speakers: {
    _id: string;
    firstName: string;
    lastName: string;
    ministry?: string;
    slug: string;
  }[];
  talks: {
    _id: string;
    description?: string;
    slug: string;
    speaker: SearchSpeaker | null;
    title: string;
  }[];
  topics: {
    _id: string;
    slug: string;
    title: string;
  }[];
}
