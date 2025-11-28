/**
 * Airtable Export Script
 *
 * Exports all data from Airtable to JSON files for migration.
 * This creates a local backup that can be used without MCP/API access.
 *
 * Usage:
 *   pnpm tsx scripts/airtable-export.ts
 *
 * Requires AIRTABLE_API_KEY in .env.local or environment.
 */

import Airtable from 'airtable';
import { config } from 'dotenv';

import fs from 'node:fs';
import path from 'node:path';

// Load .env.local
config({ path: '.env.local' });

const BASE_ID = 'appLVlrSWBfb1ga2G';
const OUTPUT_DIR = 'convex/migration/data';

// Tables to export (matching our migration plan)
const TABLES = [
  'Speakers',
  'Topics',
  'Series', // becomes Collections in Convex
  'Talks',
  'Clips',
  'Affiliate Links',
] as const;

type TableName = (typeof TABLES)[number];

type ExportedRecord = {
  fields: Record<string, unknown>;
  id: string;
};

function exportTable(base: Airtable.Base, tableName: TableName): Promise<ExportedRecord[]> {
  const records: ExportedRecord[] = [];

  return new Promise((resolve, reject) => {
    base(tableName)
      .select({
        // No view specified - fetch all records from the table
      })
      .eachPage(
        (pageRecords, fetchNextPage) => {
          for (const record of pageRecords) {
            records.push({
              fields: record.fields as Record<string, unknown>,
              id: record.id,
            });
          }
          fetchNextPage();
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        },
      );
  });
}

function getOutputFileName(tableName: TableName): string {
  const nameMap: Record<TableName, string> = {
    'Affiliate Links': 'affiliate-links.json',
    Clips: 'clips.json',
    Series: 'series.json',
    Speakers: 'speakers.json',
    Talks: 'talks.json',
    Topics: 'topics.json',
  };

  return nameMap[tableName];
}

async function main() {
  const apiKey = process.env.AIRTABLE_API_KEY;

  if (!apiKey) {
    console.error('Error: AIRTABLE_API_KEY environment variable is required');
    console.error('Get your API key from: https://airtable.com/account');
    process.exit(1);
  }

  // Configure Airtable
  Airtable.configure({ apiKey });
  const base = Airtable.base(BASE_ID);

  // Ensure output directory exists
  const outputPath = path.join(process.cwd(), OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  console.log('🚀 Starting Airtable export...\n');

  const summary: Record<string, number> = {};

  for (const tableName of TABLES) {
    try {
      console.log(`📥 Exporting ${tableName}...`);
      const records = await exportTable(base, tableName);

      const fileName = getOutputFileName(tableName);
      const filePath = path.join(outputPath, fileName);

      fs.writeFileSync(filePath, JSON.stringify(records, null, 2));

      summary[tableName] = records.length;
      console.log(`   ✅ ${records.length} records saved to ${fileName}`);
    } catch (error) {
      console.error(`   ❌ Failed to export ${tableName}:`, error);
    }
  }

  console.log('\n📊 Export Summary:');
  console.log('─'.repeat(40));
  for (const [table, count] of Object.entries(summary)) {
    console.log(`   ${table}: ${count} records`);
  }
  console.log('─'.repeat(40));
  console.log(`\n✅ Export complete! Files saved to ${OUTPUT_DIR}/`);
  console.log('\nNext step: Run the migration with:\n  pnpm convex run migration:runMigration');
}

main().catch(console.error);
