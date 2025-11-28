/**
 * Migration Runner Script
 *
 * Reads exported Airtable JSON files and runs the Convex migration.
 * This can be used without needing Airtable API access.
 *
 * Usage:
 *   pnpm tsx scripts/run-migration.ts
 *
 * Prerequisites:
 *   1. Export Airtable data first: pnpm tsx scripts/airtable-export.ts
 *   2. Have CONVEX_URL in .env.local or environment
 */

import { ConvexHttpClient } from 'convex/browser';
import { config } from 'dotenv';

import { api } from '../convex/_generated/api';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local
config({ path: '.env.local' });

const DATA_DIR = 'convex/migration/data';

interface AirtableRecord {
  fields: Record<string, unknown>;
  id: string;
}

function loadJsonFile(fileName: string): AirtableRecord[] {
  const filePath = path.join(process.cwd(), DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${fileName}`);

    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(content);
}

async function main() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

  if (!convexUrl) {
    console.error('Error: NEXT_PUBLIC_CONVEX_URL environment variable is required');
    console.error('Add NEXT_PUBLIC_CONVEX_URL to .env.local');
    process.exit(1);
  }

  console.log('📂 Loading exported Airtable data...\n');

  // Load all JSON files
  const data = {
    affiliateLinks: loadJsonFile('affiliate-links.json'),
    clips: loadJsonFile('clips.json'),
    series: loadJsonFile('series.json'),
    speakers: loadJsonFile('speakers.json'),
    talks: loadJsonFile('talks.json'),
    topics: loadJsonFile('topics.json'),
  };

  console.log('📊 Data loaded:');
  console.log(`   Speakers: ${data.speakers.length}`);
  console.log(`   Topics: ${data.topics.length}`);
  console.log(`   Series (Collections): ${data.series.length}`);
  console.log(`   Talks: ${data.talks.length}`);
  console.log(`   Clips: ${data.clips.length}`);
  console.log(`   Affiliate Links: ${data.affiliateLinks.length}`);

  // Check if any data is missing
  const hasData = Object.values(data).some((arr) => arr.length > 0);

  if (!hasData) {
    console.error('\n❌ No data found! Run the export script first:');
    console.error('   pnpm tsx scripts/airtable-export.ts');
    process.exit(1);
  }

  console.log('\n🚀 Starting migration to Convex...');
  console.log(`   Using: ${convexUrl}\n`);

  const client = new ConvexHttpClient(convexUrl);

  try {
    // Call the public migration mutation
    // @ts-expect-error - API types may not be generated yet
    const result = await client.mutation(api.migration.runMigration.runMigration, {
      affiliateLinks: data.affiliateLinks,
      clips: data.clips,
      series: data.series,
      speakers: data.speakers,
      talks: data.talks,
      topics: data.topics,
    });

    console.log('\n✅ Migration complete!');
    console.log('📊 Results:', result);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
