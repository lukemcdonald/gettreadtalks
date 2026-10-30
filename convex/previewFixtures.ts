/** Preview seed records. Keep this module free of Convex server imports so E2E can import it. */

export const PLACEHOLDER_DESCRIPTION =
  'Placeholder content for preview testing.';

export const PREVIEW_SPEAKERS = {
  JOHN_DOE: {
    description: PLACEHOLDER_DESCRIPTION,
    featured: true,
    firstName: 'John',
    lastName: 'Doe',
    ministry: 'Sample Chapel',
    role: 'Pastor' as const,
    slug: 'john-doe',
    websiteUrl: 'https://example.com/john-doe',
  },
  MARY_SMITH: {
    description: 'Placeholder author for preview testing.',
    featured: false,
    firstName: 'Mary',
    lastName: 'Smith',
    ministry: 'Example Study Press',
    role: 'Author' as const,
    slug: 'mary-smith',
    websiteUrl: 'https://example.com/mary-smith',
  },
};

export const PREVIEW_TOPICS = {
  GRACE: {
    description: PLACEHOLDER_DESCRIPTION,
    slug: 'grace',
    title: 'Grace',
  },
  PRAYER: {
    description: PLACEHOLDER_DESCRIPTION,
    slug: 'prayer',
    title: 'Prayer',
  },
};

export const PREVIEW_COLLECTIONS = {
  THE_PSALMS: {
    description: PLACEHOLDER_DESCRIPTION,
    slug: 'example-series-the-psalms',
    title: 'Example Series: The Psalms',
  },
  SAMPLE_CONFERENCE: {
    description: PLACEHOLDER_DESCRIPTION,
    slug: 'sample-conference-2026',
    title: 'Sample Conference 2026',
  },
};

export const PREVIEW_TALKS = {
  ROMANS_8: {
    collectionOrder: 1,
    collectionSlug: PREVIEW_COLLECTIONS.SAMPLE_CONFERENCE.slug,
    featured: true,
    mediaUrl: 'https://www.youtube.com/live/0SVTl4Xa5fY',
    publishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
    scripture: 'Romans 8:28',
    slug: 'sample-sermon-on-romans-8',
    speakerSlug: PREVIEW_SPEAKERS.JOHN_DOE.slug,
    status: 'published' as const,
    summary:
      'This talk traces Romans 8:28 to show that God is not merely present in trouble but at work through it.',
    title: 'Sample Sermon on Romans 8',
    topicSlugs: [PREVIEW_TOPICS.GRACE.slug],
  },
  THE_LORD_IS_MY_SHEPHERD: {
    collectionOrder: 1,
    collectionSlug: PREVIEW_COLLECTIONS.THE_PSALMS.slug,
    featured: false,
    mediaUrl: 'https://www.youtube.com/watch?v=j9phNEaPrv8',
    publishedAt: Date.parse('2024-06-02T12:00:00.000Z'),
    scripture: 'Psalm 23:1-3',
    slug: 'sample-talk-the-lord-is-my-shepherd',
    speakerSlug: PREVIEW_SPEAKERS.JOHN_DOE.slug,
    status: 'published' as const,
    summary:
      'This talk walks Psalm 23 as a shepherd who restores, leads, and stays with his people, even in the dark valley.',
    title: 'Sample Talk: The Lord Is My Shepherd',
    topicSlugs: [PREVIEW_TOPICS.PRAYER.slug],
  },
  BLESS_THE_LORD: {
    collectionOrder: 2,
    collectionSlug: PREVIEW_COLLECTIONS.THE_PSALMS.slug,
    featured: false,
    mediaUrl: 'https://www.youtube.com/watch?v=plSNIwhAn5o',
    publishedAt: Date.parse('2024-06-01T12:00:00.000Z'),
    scripture: 'Psalm 103:1-2',
    slug: 'example-talk-bless-the-lord',
    speakerSlug: PREVIEW_SPEAKERS.JOHN_DOE.slug,
    status: 'published' as const,
    title: 'Example Talk: Bless the Lord',
    topicSlugs: [PREVIEW_TOPICS.GRACE.slug],
  },
  THE_PRODIGAL_SON: {
    collectionOrder: 2,
    collectionSlug: PREVIEW_COLLECTIONS.SAMPLE_CONFERENCE.slug,
    featured: false,
    mediaUrl: 'https://www.youtube.com/watch?v=26z_KhwNdD8',
    publishedAt: Date.parse('2024-06-04T12:00:00.000Z'),
    scripture: 'Luke 15:11-32',
    slug: 'example-talk-the-prodigal-son',
    speakerSlug: PREVIEW_SPEAKERS.MARY_SMITH.slug,
    status: 'published' as const,
    summary:
      'This talk follows the younger son home in Luke 15 and shows that the father runs to meet him before the apology is finished.\n\nGrace here is not a thin pardon. It is a restored place at the table, given at cost to the father.',
    title: 'Example Talk: The Prodigal Son',
    topicSlugs: [PREVIEW_TOPICS.GRACE.slug, PREVIEW_TOPICS.PRAYER.slug],
  },
};

export const PREVIEW_STUDIES = {
  ROMANS_8: {
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
    suggestedTopics: [PREVIEW_TOPICS.GRACE.slug],
    summary:
      'This talk traces Romans 8:28 to show that God is not merely present in trouble but at work through it.',
    talkSlug: PREVIEW_TALKS.ROMANS_8.slug,
  },
  THE_LORD_IS_MY_SHEPHERD: {
    generator: 'grok-bot',
    outline: [
      {
        heading: 'The Lord shepherds',
        text: 'The psalm is not advice about coping. It is a claim that the Lord himself shepherds his people.',
      },
    ],
    scriptureRefs: [{ book: 'Psalm', chapter: 23, verseEnd: 3, verseStart: 1 }],
    studyGuide: [
      {
        kind: 'key_idea' as const,
        text: 'The Lord restores, leads, and stays with his people.',
      },
    ],
    studyStatus: 'published' as const,
    suggestedTopics: [PREVIEW_TOPICS.PRAYER.slug],
    summary:
      'This talk walks Psalm 23 as a shepherd who restores, leads, and stays with his people, even in the dark valley.',
    talkSlug: PREVIEW_TALKS.THE_LORD_IS_MY_SHEPHERD.slug,
  },
  THE_PRODIGAL_SON: {
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
    suggestedTopics: [PREVIEW_TOPICS.GRACE.slug],
    summary:
      'This talk follows the younger son home in Luke 15 and shows that the father runs to meet him before the apology is finished.\n\nGrace here is not a thin pardon. It is a restored place at the table, given at cost to the father.',
    talkSlug: PREVIEW_TALKS.THE_PRODIGAL_SON.slug,
  },
};

export const PREVIEW_TALK_FEATURES = {
  ROMANS_8: {
    body: `## Main points

### God works in all things
God is not merely present in trouble. He is at work through it for those who love him. Romans 8:28

### The good is the Son
The good he is after is not comfort first. It is being shaped like the Son. Romans 8:29

## Key passages

### Romans 8:28
The promise that God is at work in every circumstance for those who love him.

### Romans 8:29
The good in view is being conformed to the image of the Son.`,
    kind: 'study' as const,
    status: 'draft' as const,
    talkSlug: PREVIEW_TALKS.ROMANS_8.slug,
  },
  THE_PRODIGAL_SON: {
    body: `## Main points

### A father who runs
The father does not wait for the son to finish a speech. He runs to meet him. Luke 15:20

### An older brother who stays out
The older brother stands outside the feast, measuring love by labor. Luke 15:28-32

### A place at the table
Grace here is not a thin pardon. It is a restored place at the table. Luke 15:22-24, Romans 5:8

## Key passages

### Luke 15:11-32
The father runs to the returning son before the apology is finished.

### Luke 15:22-24
Grace is a restored place at the table, given at cost.`,
    kind: 'study' as const,
    status: 'published' as const,
    talkSlug: PREVIEW_TALKS.THE_PRODIGAL_SON.slug,
  },
};

export const PREVIEW_TRANSCRIPTS = {
  ROMANS_8: {
    quality: 'good' as const,
    source: 'speaker_published' as const,
    status: 'done' as const,
    talkSlug: PREVIEW_TALKS.ROMANS_8.slug,
    text: 'Placeholder transcript for preview testing. We know that for those who love God all things work together for good, for those who are called according to his purpose.',
    wordCount: 32,
  },
};

export const PREVIEW_CLIPS = {
  NO_CONDEMNATION: {
    description: PLACEHOLDER_DESCRIPTION,
    mediaUrl: 'https://www.youtube.com/watch?v=0SVTl4Xa5fY',
    publishedAt: Date.parse('2024-06-03T12:30:00.000Z'),
    slug: 'sample-clip-no-condemnation',
    speakerSlug: PREVIEW_SPEAKERS.JOHN_DOE.slug,
    status: 'published' as const,
    talkSlug: PREVIEW_TALKS.ROMANS_8.slug,
    title: 'Sample Clip: No Condemnation',
  },
};
