import type { Id, TableNames } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

import { faker } from '@faker-js/faker';
import { v } from 'convex/values';

import { internalMutation } from './_generated/server';
import { generateClips } from './seed/generators/clips';
import { generateCollections } from './seed/generators/collections';
import { generateSpeakers } from './seed/generators/speakers';
import { generateTalks } from './seed/generators/talks';
import { generateTopics } from './seed/generators/topics';
import { randomInt, randomSubset } from './seed/utils';

// Use fixed seed for consistent, reproducible data across resets
// Change this number if you want a different "batch" of seed data
faker.seed(42);

/**
 * Main seed function - populates database with realistic development data
 *
 * @param force - If true, clears all data before seeding
 *
 * Usage:
 *   pnpm seed                    # Seeds if data doesn't exist
 *   pnpm seed:force              # Clears and re-seeds all data
 */
export const seed = internalMutation({
  args: {
    force: v.optional(v.boolean()),
  },
  handler: async (ctx, { force = false }) => {
    console.log('🌱 Starting seed process...');

    // Check if data already exists
    const existingTopics = await ctx.db.query('topics').first();
    if (existingTopics && !force) {
      console.log('⚠️  Data already exists. Use force flag to re-seed.');
      console.log('   Run: pnpm seed:force');
      return null;
    }

    // Clear all tables if force=true
    if (force) {
      console.log('🗑️  Clearing existing data...');
      await clearAllTables(ctx);
    }

    // Seed in dependency order
    console.log('📚 Seeding topics (using real topics from site)...');
    const topicIds = await seedTopics(ctx);
    console.log(`   ✓ Created ${topicIds.length} topics`);

    console.log('🎤 Seeding speakers (using real names from site)...');
    const speakerIds = await seedSpeakers(ctx);
    console.log(`   ✓ Created ${speakerIds.length} speakers`);

    console.log('🎬 Seeding talks...');
    const talkIds = await seedTalks(ctx, speakerIds);
    console.log(`   ✓ Created ${talkIds.length} talks`);

    console.log('📦 Seeding collections...');
    const collectionIds = await seedCollections(ctx, talkIds);
    console.log(`   ✓ Created ${collectionIds.length} collections`);

    console.log('🎞️  Seeding clips...');
    const clipIds = await seedClips(ctx, talkIds, speakerIds);
    console.log(`   ✓ Created ${clipIds.length} clips`);

    console.log('🔗 Creating topic relationships...');
    await seedTalksOnTopics(ctx, talkIds, topicIds);
    await seedClipsOnTopics(ctx, clipIds, topicIds);
    console.log('   ✓ Created topic relationships');

    console.log('✅ Seeding complete!');
    console.log('');
    console.log('Summary:');
    console.log(`  - ${topicIds.length} topics`);
    console.log(`  - ${speakerIds.length} speakers`);
    console.log(`  - ${talkIds.length} talks`);
    console.log(`  - ${collectionIds.length} collections`);
    console.log(`  - ${clipIds.length} clips`);

    return null;
  },
  returns: v.null(),
});

/**
 * Clear all data from all tables
 */
async function clearAllTables(ctx: MutationCtx): Promise<void> {
  const tables = [
    'userFinishedTalks',
    'userFavoriteTalks',
    'userFavoriteSpeakers',
    'userFavoriteClips',
    'clipsOnTopics',
    'talksOnTopics',
    'clips',
    'collections',
    'talks',
    'speakers',
    'topics',
  ];

  for (const table of tables) {
    const documents = await ctx.db.query(table as TableNames).collect();
    await Promise.all(documents.map((doc) => ctx.db.delete(doc._id)));
  }
}

/**
 * Seed topics from curated list
 */
async function seedTopics(ctx: MutationCtx): Promise<Array<Id<'topics'>>> {
  const topicsData = generateTopics();

  const topicIds = await Promise.all(
    topicsData.map((topic) =>
      ctx.db.insert('topics', {
        slug: topic.slug,
        title: topic.title,
      }),
    ),
  );

  return topicIds;
}

/**
 * Seed speakers with varied data using real speaker names
 */
async function seedSpeakers(ctx: MutationCtx): Promise<Array<Id<'speakers'>>> {
  const speakersData = generateSpeakers();

  const speakerIds = await Promise.all(
    speakersData.map((speaker) =>
      ctx.db.insert('speakers', {
        description: speaker.description,
        featured: speaker.featured,
        firstName: speaker.firstName,
        imageUrl: speaker.imageUrl,
        lastName: speaker.lastName,
        ministry: speaker.ministry,
        role: speaker.role,
        slug: speaker.slug,
        websiteUrl: speaker.websiteUrl,
      }),
    ),
  );

  return speakerIds;
}

/**
 * Seed talks with realistic distribution
 */
async function seedTalks(
  ctx: MutationCtx,
  speakerIds: Array<Id<'speakers'>>,
): Promise<Array<Id<'talks'>>> {
  const talksData = generateTalks(100, speakerIds);

  const talkIds = await Promise.all(
    talksData.map((talk) =>
      ctx.db.insert('talks', {
        description: talk.description,
        featured: talk.featured,
        mediaUrl: talk.mediaUrl,
        publishedAt: talk.publishedAt,
        scripture: talk.scripture,
        slug: talk.slug,
        speakerId: talk.speakerId,
        status: talk.status,
        title: talk.title,
      }),
    ),
  );

  return talkIds;
}

/**
 * Seed collections and assign talks to them
 */
async function seedCollections(
  ctx: MutationCtx,
  talkIds: Array<Id<'talks'>>,
): Promise<Array<Id<'collections'>>> {
  const collectionsData = generateCollections(8);

  const collectionIds = await Promise.all(
    collectionsData.map((collection) =>
      ctx.db.insert('collections', {
        description: collection.description,
        slug: collection.slug,
        title: collection.title,
        url: collection.url,
      }),
    ),
  );

  // Assign talks to collections (each collection gets 5-15 talks)
  for (const collectionId of collectionIds) {
    const talksForCollection = randomInt(5, 15);
    const selectedTalks = randomSubset(talkIds, talksForCollection);

    // Update talks with collection assignment
    await Promise.all(
      selectedTalks.map((talkId, index) =>
        ctx.db.patch(talkId, {
          collectionId,
          collectionOrder: index + 1,
        }),
      ),
    );
  }

  return collectionIds;
}

/**
 * Seed clips with varied data
 */
async function seedClips(
  ctx: MutationCtx,
  talkIds: Array<Id<'talks'>>,
  speakerIds: Array<Id<'speakers'>>,
): Promise<Array<Id<'clips'>>> {
  const clipsData = generateClips(200, talkIds, speakerIds);

  const clipIds = await Promise.all(
    clipsData.map((clip) =>
      ctx.db.insert('clips', {
        description: clip.description,
        mediaUrl: clip.mediaUrl,
        publishedAt: clip.publishedAt,
        slug: clip.slug,
        speakerId: clip.speakerId,
        status: clip.status,
        talkId: clip.talkId,
        title: clip.title,
      }),
    ),
  );

  return clipIds;
}

/**
 * Create relationships between talks and topics
 */
async function seedTalksOnTopics(
  ctx: MutationCtx,
  talkIds: Array<Id<'talks'>>,
  topicIds: Array<Id<'topics'>>,
): Promise<void> {
  // Each talk gets 2-4 topics
  const relationships: Array<{ talkId: Id<'talks'>; topicId: Id<'topics'> }> = [];

  for (const talkId of talkIds) {
    const topicCount = randomInt(2, 4);
    const selectedTopics = randomSubset(topicIds, topicCount);

    for (const topicId of selectedTopics) {
      relationships.push({ talkId, topicId });
    }
  }

  await Promise.all(
    relationships.map((rel) =>
      ctx.db.insert('talksOnTopics', {
        talkId: rel.talkId,
        topicId: rel.topicId,
      }),
    ),
  );
}

/**
 * Create relationships between clips and topics
 */
async function seedClipsOnTopics(
  ctx: MutationCtx,
  clipIds: Array<Id<'clips'>>,
  topicIds: Array<Id<'topics'>>,
): Promise<void> {
  // Each clip gets 1-3 topics
  const relationships: Array<{ clipId: Id<'clips'>; topicId: Id<'topics'> }> = [];

  for (const clipId of clipIds) {
    const topicCount = randomInt(1, 3);
    const selectedTopics = randomSubset(topicIds, topicCount);

    for (const topicId of selectedTopics) {
      relationships.push({ clipId, topicId });
    }
  }

  await Promise.all(
    relationships.map((rel) =>
      ctx.db.insert('clipsOnTopics', {
        clipId: rel.clipId,
        topicId: rel.topicId,
      }),
    ),
  );
}
