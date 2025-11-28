# Data Migration

Seeds the Convex database from JSON files exported from Airtable.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm db:seed` | Seed development database |
| `pnpm db:seed:prod` | Seed production database |
| `pnpm db:clear` | Clear development database |
| `pnpm db:clear:prod` | Clear production database |

## Quick Start

### Development

```bash
pnpm db:clear
pnpm db:seed
```

### Production

```bash
pnpm convex deploy
pnpm db:clear:prod
pnpm db:seed:prod
```

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

## Verify

```bash
npx convex data speakers
npx convex data talks --prod
```

Expected: 79 speakers, 54 topics, 15 collections, 304 talks, 7 clips, 8 affiliate links.
