/**
 * Database Seed Script
 *
 * Seeds the Convex database from JSON files in convex/migration/data/.
 *
 * Usage:
 *   pnpm db:seed          # Development
 *   pnpm db:seed:prod     # Production
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_CONVEX_URL in .env.local
 *   - For production: pnpm convex deploy first
 */

import { ConvexHttpClient } from 'convex/browser';
import { config } from 'dotenv';

import { api } from '../convex/_generated/api';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local
config({ path: '.env.local' });

const DATA_DIR = 'convex/migration/data';

// Check for --prod flag
const isProd = process.argv.includes('--prod');

type AirtableRecord = {
  fields: Record<string, unknown>;
  id: string;
};

function loadJsonFile(fileName: string): AirtableRecord[] {
  const filePath = path.join(process.cwd(), DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${fileName}`);

    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  return JSON.parse(content);
}

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

async function main() {
  const env = isProd ? '🔴 PRODUCTION' : '🟢 Development';
  const convexUrl = getConvexUrl();

  console.log(`🗄️  Database Seed (${env})\n`);
  console.log('📂 Loading seed data...\n');

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
    console.error('\n❌ No data found in convex/migration/data/');
    console.error('   Ensure JSON files exist: speakers.json, talks.json, etc.');
    process.exit(1);
  }

  console.log('\n🚀 Starting database seed...');
  console.log(`   Target: ${convexUrl}`);

  if (isProd) {
    console.log('\n⚠️  WARNING: This will modify your PRODUCTION database!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log('');
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

    console.log('\n✅ Seed complete!');
    console.log('📊 Results:', result);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
