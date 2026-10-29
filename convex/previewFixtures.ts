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
    description: 'Placeholder author for preview testing.',
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
    description: PLACEHOLDER_DESCRIPTION,
    slug: 'grace',
    title: 'Grace',
  },
  {
    description: PLACEHOLDER_DESCRIPTION,
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
    featured: true,
    mediaUrl: 'https://www.youtube.com/live/0SVTl4Xa5fY',
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

export const PREVIEW_STUDIES = [
  {
    generator: 'grok-bot',
    outline: [
      {
        heading: 'God works for good',
        text: 'Every circumstance in the life of those who love God is gathered up into his purpose.',
      },
    ],
    scriptureRefs: [
      { book: 'Romans', chapter: 8, verseEnd: 28, verseStart: 28 },
    ],
    studyGuide: [
      {
        kind: 'key_idea' as const,
        text: 'God is at work in all things for the good of those who love him.',
      },
    ],
    studyStatus: 'draft' as const,
    suggestedTopics: ['grace'],
    summary:
      'This talk traces Romans 8:28 to show that God is not merely present in trouble but at work through it.',
    talkSlug: 'sample-sermon-on-romans-8',
  },
  {
    generator: 'grok-bot',
    outline: [
      {
        heading: 'A father who runs',
        text: 'The father does not wait for the son to finish a speech. He runs to meet him.',
      },
    ],
    scriptureRefs: [
      { book: 'Luke', chapter: 15, verseEnd: 32, verseStart: 11 },
    ],
    studyGuide: [
      {
        kind: 'key_idea' as const,
        text: 'The father runs to the returning son before a word of apology is finished.',
      },
    ],
    studyStatus: 'published' as const,
    suggestedTopics: ['grace'],
    summary:
      'This talk follows the younger son home in Luke 15 and shows that the father runs to meet him before the apology is finished.\n\nGrace here is not a thin pardon. It is a restored place at the table, given at cost to the father.',
    talkSlug: 'example-talk-the-prodigal-son',
  },
];

export const PREVIEW_TRANSCRIPTS = [
  {
    quality: 'good' as const,
    source: 'speaker_published' as const,
    status: 'done' as const,
    talkSlug: 'sample-sermon-on-romans-8',
    text: 'Placeholder transcript for preview testing. We know that for those who love God all things work together for good, for those who are called according to his purpose.',
    wordCount: 32,
  },
];

export const PREVIEW_CLIPS = [
  {
    description: PLACEHOLDER_DESCRIPTION,
    mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
    publishedAt: Date.parse('2024-06-03T12:30:00.000Z'),
    slug: 'sample-clip-no-condemnation',
    speakerSlug: 'john-doe',
    status: 'published' as const,
    talkSlug: 'sample-sermon-on-romans-8',
    title: 'Sample Clip: No Condemnation',
  },
];
