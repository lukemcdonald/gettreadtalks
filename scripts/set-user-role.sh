#!/usr/bin/env bash
# Set a Better Auth user's role via the internal Convex mutation.
set -euo pipefail

if [ "$#" -ne 4 ] || [ "$1" != "--deployment" ]; then
  echo "Usage: scripts/set-user-role.sh --deployment <dev|prod|NAME> <userId> <role>" >&2
  exit 1
fi

deployment="$2"
user_id="$3"
role="$4"

args="$(
  ROLE="$role" USER_ID="$user_id" node --input-type=module -e \
    'console.log(JSON.stringify({ role: process.env.ROLE, userId: process.env.USER_ID }))'
)"

npx convex run --deployment "${deployment}" \
  internal.model.users.mutations.setUserRoleInternal \
  "${args}"
