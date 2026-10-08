export const PLACEHOLDER_DESCRIPTION =
  'Placeholder content for preview testing.';

export const PREVIEW_SPEAKERS = [
  {
    description: PLACEHOLDER_DESCRIPTION,
    featured: true,
    firstName: 'John',
    lastName: 'Doe',
    ministry: 'Sample Chapel',
    role: 'Pastor' as const,
    slug: 'john-doe',
    websiteUrl: 'https://example.com/john-doe',
  },
  {
    description: PLACEHOLDER_DESCRIPTION,
    featured: false,
    firstName: 'Mary',
    lastName: 'Smith',
    ministry: 'Example Study Press',
    role: 'Author' as const,
    slug: 'mary-smith',
    websiteUrl: 'https://example.com/mary-smith',
  },
];

export const PREVIEW_TOPICS = [
  {
    slug: 'grace',
    title: 'Grace',
  },
  {
    slug: 'prayer',
    title: 'Prayer',
  },
];

export const PREVIEW_COLLECTIONS = [
  {
    description: PLACEHOLDER_DESCRIPTION,
    slug: 'example-series-the-psalms',
    title: 'Example Series: The Psalms',
  },
  {
    description: PLACEHOLDER_DESCRIPTION,
    slug: 'sample-conference-2026',
    title: 'Sample Conference 2026',
  },
];

export const PREVIEW_TALKS = [
  {
    collectionOrder: 1,
    collectionSlug: 'sample-conference-2026',
    description: PLACEHOLDER_DESCRIPTION,
    featured: true,
    mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
    publishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
    scripture: 'Romans 8:28',
    slug: 'sample-sermon-on-romans-8',
    speakerSlug: 'john-doe',
    status: 'published' as const,
    title: 'Sample Sermon on Romans 8',
    topicSlugs: ['grace'],
  },
  {
    collectionOrder: 1,
    collectionSlug: 'example-series-the-psalms',
    description: PLACEHOLDER_DESCRIPTION,
    featured: false,
    mediaUrl: 'https://www.youtube.com/watch?v=j9phNEaPrv8',
    publishedAt: Date.parse('2024-06-02T12:00:00.000Z'),
    scripture: 'Psalm 23:1-3',
    slug: 'sample-talk-the-lord-is-my-shepherd',
    speakerSlug: 'john-doe',
    status: 'published' as const,
    title: 'Sample Talk: The Lord Is My Shepherd',
    topicSlugs: ['prayer'],
  },
  {
    collectionOrder: 2,
    collectionSlug: 'example-series-the-psalms',
    description: PLACEHOLDER_DESCRIPTION,
    featured: false,
    mediaUrl: 'https://www.youtube.com/watch?v=plSNIwhAn5o',
    publishedAt: Date.parse('2024-06-01T12:00:00.000Z'),
    scripture: 'Psalm 103:1-2',
    slug: 'example-talk-bless-the-lord',
    speakerSlug: 'john-doe',
    status: 'published' as const,
    title: 'Example Talk: Bless the Lord',
    topicSlugs: ['grace'],
  },
  {
    collectionOrder: 2,
    collectionSlug: 'sample-conference-2026',
    description: PLACEHOLDER_DESCRIPTION,
    featured: false,
    mediaUrl: 'https://www.youtube.com/watch?v=26z_KhwNdD8',
    publishedAt: Date.parse('2024-06-04T12:00:00.000Z'),
    scripture: 'Luke 15:11-32',
    slug: 'example-talk-the-prodigal-son',
    speakerSlug: 'mary-smith',
    status: 'published' as const,
    title: 'Example Talk: The Prodigal Son',
    topicSlugs: ['grace', 'prayer'],
  },
];

export const RETIRED_PREVIEW_SLUGS = {
  collections: ['preview-conference', 'preview-series'],
  speakers: ['ada-preview', 'jane-doe', 'theo-sample'],
  talks: [
    'preview-backlog-talk',
    'preview-evening-talk',
    'preview-featured-talk',
    'preview-published-talk',
  ],
  topics: ['preview-faith', 'preview-grace'],
} as const;

export function slugsToDelete(
  current: readonly string[],
  retired: readonly string[]
) {
  return retired.filter((slug) => !current.includes(slug));
}
