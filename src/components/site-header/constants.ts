import { buildClipsPath } from '@/features/clips/utils';
import { buildCollectionsPath } from '@/features/collections/utils';
import { buildSpeakersPath } from '@/features/speakers/utils';
import { buildTalksPath } from '@/features/talks/utils';
import { buildTopicsPath } from '@/features/topics/utils';

export const NAVIGATION_LINKS = [
  { href: buildTalksPath(), label: 'Talks' },
  { href: buildSpeakersPath(), label: 'Speakers' },
  { href: buildTopicsPath(), label: 'Topics' },
  { href: buildCollectionsPath(), label: 'Collections' },
  { href: buildClipsPath(), label: 'Clips' },
] as const;
