import { Mail, Rss } from 'lucide-react';

import { Copyright } from '@/components/site-footer/copyright';

export function FooterInfo() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-muted-foreground text-sm">
        <Copyright />
      </p>
      <p className="text-muted-foreground text-sm">
        Made with <span className="text-red-500">❤️</span> by Luke McDonald
      </p>
      <div className="flex items-center gap-4">
        <a
          aria-label="Send email to contact@gettreadtalks.com"
          className="text-muted-foreground transition-colors hover:text-foreground"
          href="mailto:contact@gettreadtalks.com"
        >
          <Mail className="size-5" />
        </a>
        <a
          aria-label="RSS feed"
          className="text-muted-foreground transition-colors hover:text-foreground"
          href="/feed"
        >
          <Rss className="size-5" />
        </a>
      </div>
    </div>
  );
}
