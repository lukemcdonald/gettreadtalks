/**
 * Cleanup Speaker Images Script
 *
 * Removes imageUrl from speakers in the database that don't have
 * corresponding image files in public/images/speakers/.
 *
 * Usage:
 *   pnpm tsx scripts/cleanup-speaker-images.ts          # Development
 *   pnpm tsx scripts/cleanup-speaker-images.ts --prod # Production
 */

import type { Id } from '../convex/_generated/dataModel';

import { ConvexHttpClient } from 'convex/browser';
import { config } from 'dotenv';

import { api } from '../convex/_generated/api';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local
config({ path: '.env.local' });

const IMAGES_DIR = 'public/images/speakers';
const IMAGE_EXT_REGEX = /\.(jpg|jpeg)$/i;
const IMAGE_URL_REGEX = /\/images\/speakers\/([^/]+)\.(jpg|jpeg)$/i;

// Check for --prod flag
const isProd = process.argv.includes('--prod');

function getConvexUrl(): string {
  if (isProd) {
    // Get production URL from Convex CLI
    try {
      const result = execSync('npx convex env get CONVEX_URL --prod', {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();

      if (result) {
        return result;
      }
    } catch {
      // Fall back to checking .env.production or environment
    }

    // Check for production URL in environment
    const prodUrl = process.env.CONVEX_PROD_URL || process.env.CONVEX_DEPLOYMENT_URL;

    if (prodUrl) {
      return prodUrl;
    }

    console.error('❌ Could not determine production Convex URL.');
    console.error('   Make sure you have deployed to production: pnpm convex deploy');
    process.exit(1);
  }

  // Development URL
  const devUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

  if (!devUrl) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL environment variable is required');
    console.error('   Add NEXT_PUBLIC_CONVEX_URL to .env.local');
    process.exit(1);
  }

  return devUrl;
}

function getImageFiles(): Set<string> {
  const imagesPath = path.join(process.cwd(), IMAGES_DIR);

  if (!fs.existsSync(imagesPath)) {
    console.warn(`⚠️  Images directory not found: ${IMAGES_DIR}`);
    return new Set();
  }

  const files = fs.readdirSync(imagesPath);
  const imageFiles = new Set<string>();

  for (const file of files) {
    // Extract slug from filename (e.g., "nate-pickowicz.jpg" -> "nate-pickowicz")
    if (IMAGE_EXT_REGEX.test(file)) {
      const slug = file.replace(IMAGE_EXT_REGEX, '');
      imageFiles.add(slug);
    }
  }

  return imageFiles;
}

function extractSlugFromImageUrl(imageUrl: string | undefined): string | null {
  if (!imageUrl) {
    return null;
  }

  // Extract slug from URL like "/images/speakers/nate-pickowicz.jpg"
  const match = imageUrl.match(IMAGE_URL_REGEX);

  if (!match) {
    return null;
  }

  return match[1];
}

async function main() {
  const env = isProd ? '🔴 PRODUCTION' : '🟢 Development';
  const convexUrl = getConvexUrl();

  console.log(`🧹 Speaker Image Cleanup (${env})\n`);
  console.log('📂 Scanning image files...\n');

  // Get all image files from public folder
  const imageFiles = getImageFiles();
  console.log(`✅ Found ${imageFiles.size} image files in ${IMAGES_DIR}\n`);

  console.log('📊 Fetching speakers from database...\n');
  const client = new ConvexHttpClient(convexUrl);

  // Get all speakers
  const allSpeakers = await client.query(api.model.speakers.queries.listAllSpeakersRaw, {});

  console.log(`✅ Found ${allSpeakers.length} speakers in database\n`);

  // Find speakers with imageUrl but no corresponding file
  const speakersToClean: string[] = [];

  for (const speaker of allSpeakers) {
    if (!speaker.imageUrl) {
      continue;
    }

    const slug = extractSlugFromImageUrl(speaker.imageUrl);

    if (!slug) {
      // Invalid imageUrl format, should be cleaned
      speakersToClean.push(speaker._id);
      console.log(
        `⚠️  Invalid imageUrl format: ${speaker.firstName} ${speaker.lastName} (${speaker.imageUrl})`,
      );
      continue;
    }

    // Check if image file exists
    if (!imageFiles.has(slug)) {
      speakersToClean.push(speaker._id);
      console.log(
        `❌ Missing image: ${speaker.firstName} ${speaker.lastName} (slug: ${slug}, imageUrl: ${speaker.imageUrl})`,
      );
    }
  }

  if (speakersToClean.length === 0) {
    console.log('\n✅ All speakers have valid image files! No cleanup needed.');
    return;
  }

  console.log(`\n📋 Found ${speakersToClean.length} speakers to clean up\n`);

  if (isProd) {
    console.log('⚠️  WARNING: This will modify your PRODUCTION database!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log('🧹 Cleaning up speaker images...\n');

  try {
    const result = await client.mutation(api.migration.cleanupSpeakerImages.cleanupSpeakerImages, {
      speakerIds: speakersToClean as Id<'speakers'>[],
    });

    console.log('\n✅ Cleanup complete!');
    console.log(`   Cleaned: ${result.cleaned} speakers`);
    console.log(`   Total processed: ${result.total} speakers`);
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
