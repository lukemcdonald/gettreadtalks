export const SEARCH_RESULT_TYPES = [
  'talk',
  'speaker',
  'topic',
  'clip',
] as const;

export type SearchResultType = (typeof SEARCH_RESULT_TYPES)[number];

export interface CommandSearchItem {
  href: string;
  label: string;
  subtitle?: string;
  value: string;
}

export interface CommandSearchGroup {
  items: CommandSearchItem[];
  value: string;
}

export type HeaderSearchStatus = 'empty' | 'idle' | 'loading' | 'results';

export interface SearchOverlayProps {
  groups: CommandSearchGroup[];
  onOpenChange: (open: boolean) => void;
  onSelect: (item: CommandSearchItem) => void;
  onValueChange: (value: string) => void;
  open: boolean;
  status: HeaderSearchStatus;
  value: string;
}

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
