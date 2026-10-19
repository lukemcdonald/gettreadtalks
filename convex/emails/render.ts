import type { ReactElement } from 'react';

import { render } from 'react-email';

/**
 * Static `react-email` import so Convex's `convex` condition bundles the
 * edge renderer, not `@react-email/render`'s Node `node:stream` build.
 */
export async function renderEmailTemplate(template: ReactElement) {
  const html = await render(template);

  return {
    html,
    text: toPlainText(html),
  };
}

function toPlainText(html: string): string {
  return html
    .replaceAll(/<style[\s\S]*?<\/style>/giu, '')
    .replaceAll(/<script[\s\S]*?<\/script>/giu, '')
    .replaceAll(/<br\s*\/?>/giu, '\n')
    .replaceAll(/<\/p>/giu, '\n\n')
    .replaceAll(/<\/div>/giu, '\n')
    .replaceAll(/<[^>]+>/gu, '')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&apos;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll(/\n{3,}/gu, '\n\n')
    .trim();
}
