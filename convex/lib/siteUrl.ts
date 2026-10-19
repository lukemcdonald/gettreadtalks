import { site } from '../../src/configs/site';

export function getSiteUrl(): string {
  return (process.env.SITE_URL || site.url).replace(/\/$/u, '');
}
