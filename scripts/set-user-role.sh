#!/usr/bin/env bash
# Set a Better Auth user's role via the internal Convex mutation.
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: scripts/set-user-role.sh <userId> <role>" >&2
  exit 1
fi

user_id="$1"
role="$2"

npx convex run internal.model.users.mutations.setUserRoleInternal \
  "{\"userId\":\"${user_id}\",\"role\":\"${role}\"}"
