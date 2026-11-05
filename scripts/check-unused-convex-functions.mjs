#!/usr/bin/env node
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const AUTH_FUNCTIONS_ASSIGNMENT =
  /authFunctions(?:\s*:\s*\w+)?\s*=\s*internal\.auth\b/u;
const AUTH_TRIGGER_NAMES = ['onCreate', 'onDelete', 'onUpdate'];
const BARREL_EXPORT = /export\s+(?:const\s*)?\{(?<names>[^}]+)\}/gu;
const REFERENCE = /(?:api|internal)(?:\.[A-Za-z_]\w*)+\.[A-Za-z_]\w*/gu;
const REGISTRATION =
  /export\s+const\s+(?<name>\w+)\s*=\s*(?:query|mutation|action|internalQuery|internalMutation|internalAction)\s*[({]/gu;
const SKIP_DIR_NAMES = new Set([
  '.git',
  '.next',
  '.pnpm-store',
  '_generated',
  'coverage',
  'dist',
  'node_modules',
]);
const SOURCE_EXTENSIONS = new Set([
  '.cjs',
  '.js',
  '.mjs',
  '.sh',
  '.ts',
  '.tsx',
]);
const TRIGGER_REGISTRATION =
  /export\s+const\s*\{(?<names>[^}]+)\}\s*=\s*authComponent\.triggersApi\s*\(\s*\)/gu;

function toPosixPath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function toModulePath(relativePath) {
  return toPosixPath(relativePath)
    .replace(/^convex\//u, '')
    .replace(/\.[^.]+$/u, '')
    .split('/')
    .join('.');
}

function toDomain(relativePath) {
  const parts = toPosixPath(relativePath)
    .replace(/^convex\//u, '')
    .split('/');

  if (parts[0] === 'model' && parts[1]) {
    return parts[1].replace(/\.[^.]+$/u, '');
  }

  return parts[0].replace(/\.[^.]+$/u, '');
}

function parseExportedNames(names) {
  return (names ?? '')
    .split(',')
    .map((part) =>
      part
        .trim()
        .split(/\s+as\s+/u)
        .at(-1)
        ?.trim()
    )
    .filter(Boolean);
}

function isGeneratedPath(relativePath) {
  return relativePath.split(path.sep).includes('_generated');
}

function isTestPath(relativePath) {
  return (
    /(?:^|\/)e2e\//u.test(relativePath) ||
    /\.spec\.[cm]?[jt]sx?$/u.test(relativePath) ||
    /\.test\.[cm]?[jt]sx?$/u.test(relativePath)
  );
}

function stripComments(source, filename) {
  if (filename.endsWith('.sh')) {
    return source.replaceAll(/^\s*#.*$/gmu, '');
  }

  const withoutBlock = source.replaceAll(/\/\*[\s\S]*?\*\//gu, '');

  return withoutBlock.replaceAll(/(?<prefix>^|[^:'"`])\/\/.*$/gmu, '$<prefix>');
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      if (SKIP_DIR_NAMES.has(entry.name)) {
        return [];
      }

      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) {
          return [];
        }

        return await listFiles(fullPath);
      }

      if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
        return [fullPath];
      }

      return [];
    })
  );

  return nested.flat();
}

function listRegistrations(source, relativePath) {
  const registrations = [];
  const stripped = stripComments(source, relativePath);

  for (const match of stripped.matchAll(REGISTRATION)) {
    registrations.push({
      file: relativePath,
      name: match.groups?.name,
    });
  }

  for (const match of stripped.matchAll(TRIGGER_REGISTRATION)) {
    for (const name of parseExportedNames(match.groups?.names)) {
      registrations.push({
        file: relativePath,
        name,
      });
    }
  }

  return registrations;
}

function listBarrelKeys(source, relativePath) {
  const keys = new Set();
  const modulePath = toModulePath(relativePath);
  const stripped = stripComments(source, relativePath);

  for (const match of stripped.matchAll(BARREL_EXPORT)) {
    for (const name of parseExportedNames(match.groups?.names)) {
      keys.add(`${modulePath}.${name}`);
    }
  }

  return keys;
}

function listReferencedKeys(source, filename) {
  const keys = new Set();
  const stripped = stripComments(source, filename);

  for (const match of stripped.matchAll(REFERENCE)) {
    const parts = match[0].split('.');
    const name = parts.at(-1);
    const modulePath = parts.slice(1, -1).join('.');

    keys.add(`${modulePath}.${name}`);
  }

  if (AUTH_FUNCTIONS_ASSIGNMENT.test(stripped)) {
    for (const name of AUTH_TRIGGER_NAMES) {
      keys.add(`auth.${name}`);
    }
  }

  return keys;
}

function isRegistrationUsed(registration, referenced, barrels) {
  const fileKey = `${toModulePath(registration.file)}.${registration.name}`;

  if (referenced.has(fileKey)) {
    return true;
  }

  const barrelKey = `${toDomain(registration.file)}.${registration.name}`;

  return barrels.has(barrelKey) && referenced.has(barrelKey);
}

function collectFromSource(
  relativePath,
  source,
  barrels,
  referenced,
  registrations
) {
  if (
    relativePath.startsWith(`convex${path.sep}`) &&
    relativePath.endsWith('.ts')
  ) {
    registrations.push(...listRegistrations(source, relativePath));

    for (const key of listBarrelKeys(source, relativePath)) {
      barrels.add(key);
    }
  }

  for (const key of listReferencedKeys(source, relativePath)) {
    referenced.add(key);
  }
}

async function main() {
  const files = await listFiles(ROOT);
  const barrels = new Set();
  const referenced = new Set();
  const registrations = [];
  const sources = await Promise.all(
    files.map(async (file) => {
      const relativePath = path.relative(ROOT, file);

      if (isGeneratedPath(relativePath) || isTestPath(relativePath)) {
        return null;
      }

      return {
        relativePath,
        source: await readFile(file, 'utf-8'),
      };
    })
  );

  for (const entry of sources) {
    if (!entry) {
      continue;
    }

    collectFromSource(
      entry.relativePath,
      entry.source,
      barrels,
      referenced,
      registrations
    );
  }

  const unused = registrations
    .filter(
      (registration) => !isRegistrationUsed(registration, referenced, barrels)
    )
    .toSorted((left, right) => {
      if (left.name === right.name) {
        return left.file.localeCompare(right.file);
      }

      return left.name.localeCompare(right.name);
    });

  if (unused.length === 0) {
    console.log('All registered Convex functions have an api/internal caller.');
    return;
  }

  console.error('Unused registered Convex functions:');

  for (const registration of unused) {
    console.error(`  ${registration.name} (${registration.file})`);
  }

  process.exitCode = 1;
}

await main();
