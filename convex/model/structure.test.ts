import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const MODEL_ROOT = path.join(import.meta.dirname);

const STANDARD_TOP_LEVEL = new Set([
  'helpers.ts',
  'index.ts',
  'mutations.ts',
  'queries.ts',
  'schema.ts',
  'test.factory.ts',
  'validators.ts',
]);

const STANDARD_BASES = new Set([
  'helpers',
  'index',
  'mutations',
  'queries',
  'schema',
  'test.factory',
  'validators',
]);

// Legacy top-level files tracked for cleanup in a follow-up ticket; new allowlist entries need Luke's approval.
const DOMAIN_FILE_ALLOWLIST: Record<string, Record<string, string>> = {
  auth: {
    'rateLimiter.ts': 'Better Auth rate limit wiring, not CRUD.',
    'roles.ts': 'Admin role checks shared across domains.',
    'roles.test.ts': 'Tests for roles.ts.',
    'types.ts': 'Auth-specific TypeScript types.',
    'utils.ts': 'Session helpers used by roles and gates.',
  },
  mediaHealth: {
    'clear.test.ts': 'Tests for clear.ts.',
    'clear.ts': 'Stale media check cleanup.',
    'cronJob.ts': 'Scheduled media health sweep.',
    'digest.test.ts': 'Tests for digest.ts.',
    'digest.ts': 'Admin digest of media failures.',
    'oembed.test.ts': 'Tests for oembed.ts.',
    'oembed.ts': 'oEmbed probe for media URLs.',
    'record.test.ts': 'Tests for record.ts.',
    'record.ts': 'Persist media check results.',
  },
  search: {
    'constants.ts': 'Shared search limits.',
    'listAll.ts': 'Admin list-all search entry.',
    'utils.test.ts': 'Tests for search utils.',
    'utils.ts': 'Search query normalization helpers.',
  },
  talks: {
    'enrichment.ts': 'HTTP handler for external bulk enrichment webhook.',
  },
  users: {
    'deleteUser.test.ts': 'Tests for deleteUser flow in mutations.',
    'utils.ts': 'User lookup helpers without a separate queries surface.',
  },
};

function isStandardTopLevelFile(name: string) {
  if (STANDARD_TOP_LEVEL.has(name)) {
    return true;
  }

  if (!name.endsWith('.test.ts')) {
    return false;
  }

  const base = name.slice(0, -'.test.ts'.length);

  return STANDARD_BASES.has(base);
}

function listDomainDirectories() {
  return readdirSync(MODEL_ROOT).filter((entry) => {
    if (entry.startsWith('.')) {
      return false;
    }

    return statSync(path.join(MODEL_ROOT, entry)).isDirectory();
  });
}

describe('convex model domain structure', () => {
  it('keeps each domain folder to standard top-level files', () => {
    const violations: string[] = [];

    for (const domain of listDomainDirectories()) {
      const domainPath = path.join(MODEL_ROOT, domain);
      const allowlist = DOMAIN_FILE_ALLOWLIST[domain] ?? {};

      for (const entry of readdirSync(domainPath)) {
        const entryPath = path.join(domainPath, entry);

        if (statSync(entryPath).isDirectory()) {
          continue;
        }

        if (isStandardTopLevelFile(entry)) {
          continue;
        }

        if (entry in allowlist) {
          continue;
        }

        violations.push(
          `${domain}/${entry} is not a standard convex/model file. Put feature-specific code in a subfolder (see AGENTS.md Convex file structure).`
        );
      }
    }

    expect(violations).toEqual([]);
  });
});
