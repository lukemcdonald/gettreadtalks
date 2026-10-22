#!/usr/bin/env bash
# Vercel Ignored Build Step: exit 0 skips the build, exit 1 continues it.
# Draft cursor/* previews are skipped via GitHub's public PR API. Vercel only
# exposes git and VERCEL_* env here, not draft state.
set -euo pipefail

build() {
  echo "$1"
  exit 1
}

skip() {
  echo "$1"
  exit 0
}

ref="${VERCEL_GIT_COMMIT_REF:-}"

if [[ "${VERCEL_ENV:-}" == "production" || "${ref}" == "main" ]]; then
  build "Building production"
fi

if [[ "${ref}" == dependabot/* ]]; then
  build "Building Dependabot preview"
fi

if [[ "${ref}" != cursor/* ]]; then
  build "Building preview for ${ref:-unknown branch}"
fi

owner="${VERCEL_GIT_REPO_OWNER:-}"
repo="${VERCEL_GIT_REPO_SLUG:-}"

if [[ -z "${owner}" || -z "${repo}" ]]; then
  build "Missing Vercel git repo env; building cursor preview"
fi

head="$(
  node -e 'process.stdout.write(encodeURIComponent(`${process.env.VERCEL_GIT_REPO_OWNER}:${process.env.VERCEL_GIT_COMMIT_REF}`))'
)"
url="https://api.github.com/repos/${owner}/${repo}/pulls?head=${head}&state=open"
http_body="$(mktemp)"
http_code="$(
  curl -sS -o "${http_body}" -w '%{http_code}' \
    -H "Accept: application/vnd.github+json" \
    -H "User-Agent: gettreadtalks-vercel-ignore" \
    "${url}"
)" || http_code="000"

if [[ "${http_code}" != "200" ]]; then
  rm -f "${http_body}"
  build "GitHub PR lookup failed (${http_code}); building cursor preview"
fi

draft="$(
  node -e '
    const prs = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    if (!Array.isArray(prs) || prs.length === 0) {
      process.stdout.write("missing");
      process.exit(0);
    }
    process.stdout.write(prs.some((pr) => pr.draft === false) ? "ready" : "draft");
  ' "${http_body}"
)" || draft="error"
rm -f "${http_body}"

case "${draft}" in
  draft)
    skip "Skipping draft cursor preview"
    ;;
  missing)
    skip "Skipping cursor branch with no open PR"
    ;;
  ready)
    build "Building ready cursor preview"
    ;;
  *)
    build "Could not read PR draft state; building cursor preview"
    ;;
esac
