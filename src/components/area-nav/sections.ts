import type { AreaNavSection } from './area-nav';

import {
  ACCOUNT_PATH,
  ADMIN_LIST_PATHS,
  MANAGE_PATH,
} from '@/lib/entities/paths';

const AREA_NAV: AreaNavSection[] = [
  {
    href: ACCOUNT_PATH,
    items: [
      { href: ACCOUNT_PATH, icon: 'settings', label: 'Settings' },
      { href: '/account/favorites', icon: 'favorites', label: 'Favorites' },
      { href: '/account/finished', icon: 'finished', label: 'Finished' },
    ],
    label: 'Account',
  },
  {
    href: ADMIN_LIST_PATHS.talks,
    items: [
      {
        children: [
          {
            href: '/manage/talks/transcripts',
            icon: 'transcripts',
            label: 'Transcripts',
          },
        ],
        href: ADMIN_LIST_PATHS.talks,
        icon: 'talks',
        label: 'Talks',
      },
      { href: ADMIN_LIST_PATHS.clips, icon: 'clips', label: 'Clips' },
      { href: ADMIN_LIST_PATHS.speakers, icon: 'speakers', label: 'Speakers' },
      { href: ADMIN_LIST_PATHS.topics, icon: 'topics', label: 'Topics' },
      {
        href: ADMIN_LIST_PATHS.collections,
        icon: 'collections',
        label: 'Collections',
      },
    ],
    label: 'Content',
  },
];

export function getVisibleSections(showContent: boolean) {
  return AREA_NAV.filter(
    (section) => showContent || !isManagePath(section.href)
  );
}

export function getActiveSection(sections: AreaNavSection[], pathname: string) {
  const [fallback] = sections;

  if (!fallback) {
    throw new Error('Area layout requires at least one section');
  }

  return (
    sections.find(
      (section) => isManagePath(section.href) === isManagePath(pathname)
    ) ?? fallback
  );
}

export function isManagePath(pathname: string) {
  return pathname === MANAGE_PATH || pathname.startsWith(`${MANAGE_PATH}/`);
}
