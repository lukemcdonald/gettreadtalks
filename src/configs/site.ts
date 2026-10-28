export const site = {
  description: 'Christ centered sermons to elevate your spiritual heartbeat.',
  email: {
    contact: 'contact@gettreadtalks.com',
    reply: 'hello@gettreadtalks.com',
  },
  locale: 'en_US',
  metaDescription:
    'Christ centered sermons to elevate your spiritual heartbeat. Browse talks, speakers, topics, and collections from faithful ministers of the Gospel.',
  name: 'TREAD Talks',
  // Resolved --background: zinc-100, and 98% zinc-950 mixed with white.
  themeColor: {
    dark: '#0e0e10',
    light: '#f4f4f5',
  },
  url: 'https://www.gettreadtalks.com',
} as const;

export function getSiteLanguage() {
  return site.locale.replaceAll('_', '-');
}
