import type { ReactElement } from 'react';

import { renderToStaticMarkup } from 'react-dom/server.browser';

export function renderEmailTemplate(template: ReactElement) {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(template)}`;

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
