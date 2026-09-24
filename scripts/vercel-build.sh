#!/usr/bin/env bash
# Vercel Git builds. Production keeps `pnpm build` (Convex prod still ships via
# `pnpm release`). Preview creates a per-branch Convex backend so function
# changes are actually runnable.
#
# One-time dashboard setup:
# 1. Convex project Settings: Generate Preview Deploy Key.
# 2. Vercel env CONVEX_DEPLOY_KEY: that key, Preview only (not Production).
# 3. Convex: `npx convex env default set --type preview NAME value` for
#    BETTER_AUTH_SECRET, RESEND_*, SENTRY_DSN (same names as other deploys).
# 4. Vercel Deployment Protection: allow testers in, or a Protection Bypass.
#
# Preview backends start empty. They do not share production talks or users.

set -euo pipefail

if [ "${VERCEL_ENV:-}" != "preview" ]; then
  exec pnpm build
fi

if [ -z "${CONVEX_DEPLOY_KEY:-}" ]; then
  echo "Preview builds need CONVEX_DEPLOY_KEY (Convex Preview Deploy Key, Vercel Preview env only)." >&2
  exit 1
fi

if [ -z "${VERCEL_URL:-}" ]; then
  echo "Preview builds need VERCEL_URL." >&2
  exit 1
fi

npx convex deploy \
  --cmd 'bash -lc "export NEXT_PUBLIC_CONVEX_SITE_URL=${NEXT_PUBLIC_CONVEX_URL/.convex.cloud/.convex.site}; pnpm build"' \
  --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL

preview_site_url="https://${VERCEL_URL}"
preview_ref="${VERCEL_GIT_COMMIT_REF:-}"

if [ -n "${preview_ref}" ]; then
  npx convex env set SITE_URL "${preview_site_url}" --deployment "preview/${preview_ref}"
else
  npx convex env set SITE_URL "${preview_site_url}"
fi
