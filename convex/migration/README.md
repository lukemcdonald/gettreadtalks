# Airtable to Convex Migration

This directory contains the migration scripts and data for transferring content from Airtable to Convex.

## Data Files

The `data/` directory contains exported Airtable records in JSON format:

| File                   | Description          | Records |
| ---------------------- | -------------------- | ------- |
| `speakers.json`        | Speaker profiles     | 79      |
| `topics.json`          | Topic categories     | 54      |
| `series.json`          | Series → Collections | 15      |
| `talks.json`           | Talk records         | 304     |
| `clips.json`           | Clip records         | 7       |
| `affiliate-links.json` | Affiliate links      | 8       |

These files serve as:

- **Backup** of the original Airtable data
- **Seed data** for future database resets
- **Reference** for data structure and content

## Quick Reference

### Clear Development Database

```bash
pnpm convex run migration/runMigration:clearAllData
```

### Run Migration (Development)

```bash
pnpm tsx scripts/run-migration.ts
```

### Run Migration (Production)

```bash
# Set production URL temporarily
NEXT_PUBLIC_CONVEX_URL=https://your-prod.convex.cloud pnpm tsx scripts/run-migration.ts
```

## Detailed Steps

### Step 1: Export Airtable Data (if needed)

If you need to re-export data from Airtable:

```bash
AIRTABLE_API_KEY=your_key pnpm tsx scripts/airtable-export.ts
```

This creates/updates JSON files in `convex/migration/data/`.

### Step 2: Clear Existing Data

**⚠️ WARNING: This permanently deletes all data in the target database!**

```bash
# Development
pnpm convex run migration/runMigration:clearAllData

# Production (use with extreme caution)
pnpm convex run --prod migration/runMigration:clearAllData
```

### Step 3: Run Migration

```bash
# Development (uses NEXT_PUBLIC_CONVEX_URL from .env.local)
pnpm tsx scripts/run-migration.ts
```

For production, either:

1. Temporarily change `NEXT_PUBLIC_CONVEX_URL` in `.env.local` to production URL
2. Or run with env override:

   ```bash
   NEXT_PUBLIC_CONVEX_URL=https://your-prod.convex.cloud pnpm tsx scripts/run-migration.ts
   ```

### Step 4: Verify Migration

1. **Check Convex Dashboard:**

   ```bash
   pnpm convex dashboard
   ```

   Navigate to "Data" tab to verify record counts.

2. **Test the Application:**

   ```bash
   pnpm dev
   ```

   Browse through speakers, talks, topics, etc.

3. **Check Record Counts:**
   - Speakers: 79
   - Topics: 54
   - Collections: 15
   - Talks: 304
   - Clips: 7
   - Affiliate Links: 8

## Import Order

The migration follows this dependency order:

1. `speakers` - No dependencies
2. `topics` - No dependencies
3. `collections` (from Series) - No dependencies
4. `talks` - Depends on: speakers, collections
5. `clips` - Depends on: talks, speakers
6. `affiliateLinks` - No dependencies
7. `talksOnTopics` - Depends on: talks, topics
8. `clipsOnTopics` - Depends on: clips, topics

## Field Mappings

### Status Mapping

| Airtable            | Convex        |
| ------------------- | ------------- |
| `published=true`    | `"published"` |
| `status="Approved"` | `"approved"`  |
| `status="Pending"`  | `"backlog"`   |
| `status="Declined"` | `"archived"`  |
| `status="Archived"` | `"archived"`  |
| Default             | `"backlog"`   |

### Table Mappings

| Airtable Table  | Convex Table   |
| --------------- | -------------- |
| Speakers        | speakers       |
| Topics          | topics         |
| Series          | collections    |
| Talks           | talks          |
| Clips           | clips          |
| Affiliate Links | affiliateLinks |

### Skipped Tables

- Pages
- Testimonies
- Scriptures

## Cleanup (After Production Migration)

Once migration is verified in production:

1. **Option A: Keep for future use**

   - Convert mutations back to `internalMutation` for security
   - Keep data files as backup/seed data

2. **Option B: Remove migration code**

   ```bash
   rm -rf convex/migration/
   rm scripts/airtable-export.ts
   rm scripts/run-migration.ts
   ```

3. **Remove seed dependencies** (if no longer needed):

   ```bash
   pnpm remove @faker-js/faker
   ```

   Also remove `convex/seed/` directory and `seed` scripts from `package.json`.

## Troubleshooting

### "Function not found" Error

Run `pnpm convex dev --once` to push the latest functions to Convex.

### CONVEX_URL Not Found

The script uses `NEXT_PUBLIC_CONVEX_URL` from `.env.local`. Make sure this variable exists.

### Missing Data Files

Run the export script first:

```bash
AIRTABLE_API_KEY=your_key pnpm tsx scripts/airtable-export.ts
```

### Slug Collisions

The migration automatically handles slug collisions by appending numbers (e.g., `slug-2`, `slug-3`).

### Missing References

Records with unresolved foreign keys (speaker, collection, etc.) are logged and skipped rather than failing the migration.
