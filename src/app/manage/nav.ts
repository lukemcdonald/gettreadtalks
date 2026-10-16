import type { AreaNavSections } from '@/components/area-nav';

export const MANAGE_NAV: AreaNavSections = [
  {
    href: '/manage/talks',
    items: [
      { href: '/manage/talks', icon: 'talks', label: 'Talks' },
      { href: '/manage/clips', icon: 'clips', label: 'Clips' },
    ],
    label: 'Content',
  },
  {
    href: '/manage/speakers',
    items: [
      { href: '/manage/speakers', icon: 'speakers', label: 'Speakers' },
      { href: '/manage/topics', icon: 'topics', label: 'Topics' },
      {
        href: '/manage/collections',
        icon: 'collections',
        label: 'Collections',
      },
    ],
    label: 'Catalog',
  },
];
