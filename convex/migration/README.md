# Airtable to Convex Migration

## Quick Start

### Development

```bash
pnpm tsx scripts/run-migration.ts
pnpm tsx scripts/update-speaker-images.ts
```

### Production

```bash
pnpm convex deploy
pnpm tsx scripts/run-migration.ts --prod
pnpm tsx scripts/update-speaker-images.ts --prod
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm tsx scripts/run-migration.ts` | Import all data to development |
| `pnpm tsx scripts/run-migration.ts --prod` | Import all data to production |
| `pnpm tsx scripts/update-speaker-images.ts` | Update speaker images (dev) |
| `pnpm tsx scripts/update-speaker-images.ts --prod` | Update speaker images (prod) |
| `pnpm convex run migration/runMigration:clearAllData` | Clear development database |
| `pnpm convex run migration/runMigration:clearAllData --prod` | Clear production database |

## Re-export from Airtable

If you need fresh data from Airtable:

```bash
pnpm tsx scripts/airtable-export.ts
```

Requires `AIRTABLE_API_KEY` in `.env.local`.

## Data Files

Located in `convex/migration/data/`:

| File | Records |
|------|---------|
| `speakers.json` | 79 |
| `topics.json` | 54 |
| `series.json` | 15 |
| `talks.json` | 304 |
| `clips.json` | 7 |
| `affiliate-links.json` | 8 |

## Verify Migration

```bash
# Check counts
npx convex data speakers
npx convex data talks --prod
```

Expected: 79 speakers, 54 topics, 15 collections, 304 talks, 7 clips, 8 affiliate links.
