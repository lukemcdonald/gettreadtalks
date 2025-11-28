/**
 * Download Speaker Images from Airtable
 *
 * Downloads speaker avatar images before Airtable URLs expire (~2 hours)
 * and saves them to /public/images/speakers/
 *
 * Usage:
 *   pnpm tsx scripts/download-speaker-images.ts
 *
 * Run this BEFORE the Airtable URLs expire!
 */

import { config } from 'dotenv';

import fs from 'node:fs';
import path from 'node:path';

// Load .env.local
config({ path: '.env.local' });

const DATA_FILE = 'convex/migration/data/speakers.json';
const OUTPUT_DIR = 'public/images/speakers';
const URL_EXTENSION_REGEX = /\.([a-zA-Z]+)(?:\?|$)/;

type AirtableAttachment = {
  id: string;
  url: string;
  filename: string;
  type: string;
};

type SpeakerRecord = {
  id: string;
  fields: {
    firstName?: string;
    lastName?: string;
    avatar?: AirtableAttachment[];
  };
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

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`    Failed to fetch: ${response.status} ${response.statusText}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`    Error downloading: ${error}`);
    return false;
  }
}

function getFileExtension(url: string): string {
  // Try to get extension from URL
  const urlMatch = url.match(URL_EXTENSION_REGEX);
  if (urlMatch) {
    const ext = urlMatch[1].toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return ext === 'jpeg' ? 'jpg' : ext;
    }
  }

  // Default to jpg
  return 'jpg';
}

async function main() {
  console.log('🖼️  Speaker Image Downloader\n');

  // Check if data file exists
  const dataPath = path.join(process.cwd(), DATA_FILE);
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Data file not found: ${DATA_FILE}`);
    console.error('   Run the Airtable export first: pnpm tsx scripts/airtable-export.ts');
    process.exit(1);
  }

  // Load speakers data
  const speakersData: SpeakerRecord[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`📂 Loaded ${speakersData.length} speakers from ${DATA_FILE}\n`);

  // Ensure output directory exists
  const outputPath = path.join(process.cwd(), OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`📁 Created directory: ${OUTPUT_DIR}\n`);
  }

  // Track results
  const results = {
    downloaded: 0,
    skipped: 0,
    failed: 0,
    noAvatar: 0,
  };

  const imageMapping: Record<string, string> = {};

  // Process each speaker
  for (const speaker of speakersData) {
    const { firstName, lastName, avatar } = speaker.fields;
    const slug = generateSlug(firstName, lastName);

    if (!slug) {
      console.log(`⚠️  Skipping speaker with no name (ID: ${speaker.id})`);
      results.skipped += 1;
      continue;
    }

    if (!avatar || avatar.length === 0) {
      console.log(`⏭️  ${firstName} ${lastName}: No avatar`);
      results.noAvatar += 1;
      continue;
    }

    const imageUrl = avatar[0].url;
    const extension = getFileExtension(imageUrl);
    const fileName = `${slug}.${extension}`;
    const filePath = path.join(outputPath, fileName);

    // Skip if already downloaded
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${firstName} ${lastName}: Already exists (${fileName})`);
      imageMapping[speaker.id] = `/images/speakers/${fileName}`;
      results.skipped += 1;
      continue;
    }

    console.log(`📥 ${firstName} ${lastName}: Downloading...`);
    const success = await downloadImage(imageUrl, filePath);

    if (success) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`    ✅ Saved: ${fileName} (${sizeKB} KB)`);
      imageMapping[speaker.id] = `/images/speakers/${fileName}`;
      results.downloaded += 1;
    } else {
      results.failed += 1;
    }
  }

  // Save image mapping for reference
  const mappingPath = path.join(process.cwd(), 'convex/migration/data/speaker-image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(imageMapping, null, 2));

  // Summary
  console.log(`\n${'─'.repeat(50)}`);
  console.log('📊 Summary:');
  console.log(`   Downloaded: ${results.downloaded}`);
  console.log(`   Already existed: ${results.skipped}`);
  console.log(`   No avatar: ${results.noAvatar}`);
  console.log(`   Failed: ${results.failed}`);
  console.log('─'.repeat(50));
  console.log(`\n✅ Images saved to: ${OUTPUT_DIR}/`);
  console.log('📄 Mapping saved to: convex/migration/data/speaker-image-mapping.json');
  console.log('\nNext step: Update speaker records with new imageUrl paths');
  console.log('   pnpm tsx scripts/update-speaker-images.ts');
}

main().catch(console.error);
