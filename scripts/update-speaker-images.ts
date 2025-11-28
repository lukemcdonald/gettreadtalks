/**
 * Update Speaker Image URLs in Convex
 *
 * Updates speaker records to use local /public image paths
 * instead of expiring Airtable URLs.
 *
 * Usage:
 *   pnpm tsx scripts/update-speaker-images.ts          # Development
 *   pnpm tsx scripts/update-speaker-images.ts --prod   # Production
 *
 * Prerequisites:
 *   1. Run check-speaker-images.ts first to generate the mapping
 *   2. Images should be in public/images/speakers/
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MAPPING_FILE = 'convex/migration/data/speaker-image-mapping.json';
const SPEAKERS_FILE = 'convex/migration/data/speakers.json';

// Check for --prod flag
const isProd = process.argv.includes('--prod');

type SpeakerRecord = {
  fields: {
    firstName?: string;
    lastName?: string;
  };
  id: string;
};

function generateSlug(firstName?: string, lastName?: string): string {
  const name = [firstName, lastName].filter(Boolean).join(' ');

  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function main() {
  const env = isProd ? '🔴 PRODUCTION' : '🟢 Development';
  console.log(`🔄 Updating Speaker Image URLs (${env})\n`);

  // Load the image mapping
  const mappingPath = path.join(process.cwd(), MAPPING_FILE);
  if (!fs.existsSync(mappingPath)) {
    console.error(`❌ Mapping file not found: ${MAPPING_FILE}`);
    console.error('   Run check-speaker-images.ts first');
    process.exit(1);
  }

  const imageMapping: Record<string, string> = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  // Load speakers data to get slugs
  const speakersPath = path.join(process.cwd(), SPEAKERS_FILE);
  const speakersData: SpeakerRecord[] = JSON.parse(fs.readFileSync(speakersPath, 'utf-8'));

  console.log(`📂 Loaded ${Object.keys(imageMapping).length} image mappings\n`);

  // Build updates array
  const updates: Array<{ imageUrl: string; slug: string }> = [];

  for (const speaker of speakersData) {
    const { firstName, lastName } = speaker.fields;
    const slug = generateSlug(firstName, lastName);
    const imageUrl = imageMapping[speaker.id];

    if (slug && imageUrl) {
      updates.push({ imageUrl, slug });
    }
  }

  console.log(`📤 Sending ${updates.length} updates to Convex...\n`);

  // Call the internal mutation via CLI
  const args = JSON.stringify({ updates });
  const prodFlag = isProd ? ' --prod' : '';
  const command = `npx convex run model/speakers/mutations:batchUpdateSpeakerImages${prodFlag} '${args}'`;

  try {
    const result = execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    console.log('✅ Result:', result.trim());
  } catch (error) {
    if (error instanceof Error && 'stderr' in error) {
      console.error('❌ Error:', (error as { stderr: string }).stderr);
    } else {
      console.error('❌ Error:', error);
    }
    process.exit(1);
  }

  console.log('\n✅ Done! Speaker images updated to use local /public paths.');
}

main().catch(console.error);
