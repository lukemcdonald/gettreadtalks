#!/usr/bin/env bash
# Vercel Git builds. Production keeps `pnpm build` (Convex prod still ships via
# `pnpm release`). Preview creates a per-branch Convex backend so function
# changes are actually runnable.
#
# `convex deploy --cmd` runs the frontend build *before* functions are pushed.
# This app prerenders routes that call Convex, so a first preview would fail
# with "Could not find public function". Push functions first, then build.
#
# One-time dashboard setup:
# 1. Convex project Settings: Generate Preview Deploy Key.
# 2. Vercel env CONVEX_DEPLOY_KEY: that key, Preview only (not Production).
# 3. Convex: `npx convex env default set --type preview NAME value` for
#    BETTER_AUTH_SECRET, RESEND_*, SENTRY_DSN (same names as other deploys).
#    Do not default SITE_URL; this script sets it per preview host.
# 4. Vercel Deployment Protection: testers use Vercel SSO, or a shareable link.
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

if [ -z "${VERCEL_GIT_COMMIT_REF:-}" ]; then
  echo "Preview builds need VERCEL_GIT_COMMIT_REF." >&2
  exit 1
fi

# Convex preview names cannot contain `/`. `deploy --preview-name` rewrites
# slashes to hyphens; `env set --deployment` does not, so use the same name.
preview_name="${VERCEL_GIT_COMMIT_REF//\//-}"
preview_site_url="https://${VERCEL_URL}"
url_file="$(mktemp)"

npx convex deploy \
  --cmd "sh -c 'printf %s \"\$NEXT_PUBLIC_CONVEX_URL\" > \"${url_file}\"'" \
  --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL \
  --preview-name "${preview_name}"

NEXT_PUBLIC_CONVEX_URL="$(cat "${url_file}")"
rm -f "${url_file}"

if [ -z "${NEXT_PUBLIC_CONVEX_URL}" ]; then
  echo "convex deploy did not provide NEXT_PUBLIC_CONVEX_URL." >&2
  exit 1
fi

export NEXT_PUBLIC_CONVEX_SITE_URL="${NEXT_PUBLIC_CONVEX_URL%.convex.cloud}.convex.site"
export NEXT_PUBLIC_CONVEX_URL

npx convex env set SITE_URL "${preview_site_url}" --deployment "preview/${preview_name}"

pnpm build
