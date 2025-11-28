/**
 * Check Speaker Images
 *
 * Compares existing images in /public/images/speakers with speaker data
 * and shows what matches and what's missing.
 */

import fs from 'node:fs';
import path from 'node:path';

const SPEAKERS_FILE = 'convex/migration/data/speakers.json';
const IMAGES_DIR = 'public/images/speakers';
const IMAGE_EXTENSION_REGEX = /\.(jpg|jpeg|png|gif|webp)$/i;

type SpeakerRecord = {
  id: string;
  fields: {
    firstName?: string;
    lastName?: string;
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

function main() {
  // Load speakers
  const speakersPath = path.join(process.cwd(), SPEAKERS_FILE);
  const speakers: SpeakerRecord[] = JSON.parse(fs.readFileSync(speakersPath, 'utf-8'));

  // Get existing images
  const imagesPath = path.join(process.cwd(), IMAGES_DIR);
  const imageFiles = fs.readdirSync(imagesPath).filter((f) => !f.startsWith('.'));

  // Create a map of base names (without extension)
  const imageBaseNames = new Set(imageFiles.map((f) => f.replace(IMAGE_EXTENSION_REGEX, '')));

  console.log('🔍 Checking Speaker Images\n');
  console.log(`📊 Speakers in data: ${speakers.length}`);
  console.log(`🖼️  Images in folder: ${imageFiles.length}\n`);

  const matched: string[] = [];
  const missing: string[] = [];
  const speakerSlugs: string[] = [];

  for (const speaker of speakers) {
    const { firstName, lastName } = speaker.fields;
    const slug = generateSlug(firstName, lastName);

    if (!slug) {
      continue;
    }

    speakerSlugs.push(slug);

    if (imageBaseNames.has(slug)) {
      matched.push(slug);
    } else {
      missing.push(`${firstName} ${lastName} (${slug})`);
    }
  }

  // Find extra images (in folder but not in speakers)
  const extraImages = imageFiles.filter((f) => {
    const baseName = f.replace(IMAGE_EXTENSION_REGEX, '');

    return !(speakerSlugs.includes(baseName) || f.includes('banner'));
  });

  console.log(`✅ MATCHED (${matched.length}):`);
  for (const s of matched) {
    console.log(`   ${s}`);
  }

  console.log(`\n❌ MISSING IMAGES (${missing.length}):`);
  for (const s of missing) {
    console.log(`   ${s}`);
  }

  console.log('\n⚠️  EXTRA IMAGES (not matching any speaker):');
  for (const f of extraImages) {
    console.log(`   ${f}`);
  }

  // Generate the mapping for matched images
  console.log('\n📄 Image URL Mapping (for database update):');
  const mapping: Record<string, string> = {};

  for (const speaker of speakers) {
    const { firstName, lastName } = speaker.fields;
    const slug = generateSlug(firstName, lastName);

    // Find matching image file
    const matchingFile = imageFiles.find((f) => f.replace(IMAGE_EXTENSION_REGEX, '') === slug);

    if (matchingFile) {
      mapping[speaker.id] = `/images/speakers/${matchingFile}`;
    }
  }

  // Save mapping
  const mappingPath = path.join(process.cwd(), 'convex/migration/data/speaker-image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log('\n✅ Saved mapping to: convex/migration/data/speaker-image-mapping.json');
  console.log(`   ${Object.keys(mapping).length} speakers mapped to images`);
}

main();
