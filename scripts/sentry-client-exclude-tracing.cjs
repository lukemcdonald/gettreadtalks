'use strict';

/**
 * Turbopack `compiler.define` is all runtimes. This loader applies
 * `__SENTRY_TRACING__ = false` only to browser Sentry code.
 */
module.exports = function sentryClientExcludeTracing(source) {
  const code = typeof source === 'string' ? source : source.toString();

  return code.replaceAll('__SENTRY_TRACING__', 'false');
};
