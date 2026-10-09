import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function resolveTsFile(absolutePath) {
  if (path.extname(absolutePath)) {
    return existsSync(absolutePath) ? absolutePath : null;
  }

  const asFile = `${absolutePath}.ts`;
  if (existsSync(asFile)) {
    return asFile;
  }

  const asIndex = path.join(absolutePath, 'index.ts');
  if (existsSync(asIndex)) {
    return asIndex;
  }

  return null;
}

export function resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') {
    return {
      format: 'module',
      shortCircuit: true,
      url: 'data:text/javascript,export default undefined',
    };
  }

  let absolutePath;

  if (specifier.startsWith('@/')) {
    absolutePath = path.join(repoRoot, 'src', specifier.slice(2));
  } else if (
    specifier.startsWith('.') &&
    !path.extname(specifier) &&
    context.parentURL
  ) {
    absolutePath = path.join(
      path.dirname(fileURLToPath(context.parentURL)),
      specifier
    );
  }

  if (absolutePath) {
    const resolved = resolveTsFile(absolutePath);
    if (resolved) {
      return nextResolve(pathToFileURL(resolved).href, context);
    }
  }

  return nextResolve(specifier, context);
}
