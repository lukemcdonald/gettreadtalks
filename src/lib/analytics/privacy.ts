import type { Context, Plugin } from '@segment/analytics-next';

import { sanitizePageProperties } from './page-context';

function sanitizeEvent(context: Context) {
  const { event } = context;
  if (event.properties) {
    event.properties = sanitizePageProperties(event.properties);
  }
  if (event.context?.page) {
    event.context.page = sanitizePageProperties(event.context.page);
  }
  return context;
}

export const privacyPlugin: Plugin = {
  alias: sanitizeEvent,
  group: sanitizeEvent,
  identify: sanitizeEvent,
  isLoaded: () => true,
  load: () => Promise.resolve(),
  name: 'URL privacy',
  page: sanitizeEvent,
  track: sanitizeEvent,
  type: 'before',
  version: '1.0.0',
};
