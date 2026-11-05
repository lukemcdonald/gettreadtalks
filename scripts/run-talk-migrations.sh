#!/usr/bin/env bash
# One-shot talk migrations. Run against production only after a backup, then
# delete these functions once the production run is confirmed.
set -euo pipefail

npx convex run internal.talks.backfillTalkPublishedAt '{}'
npx convex run internal.talks.migrateTalkSummaries '{}'
