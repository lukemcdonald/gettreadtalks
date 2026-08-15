import { Heart } from 'lucide-react';

import { Copyright } from '@/components/site-footer/copyright';

export function FooterInfo() {
  return (
    <div className="border-border flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
      <p className="text-muted-foreground text-sm">
        <Copyright />
      </p>
      <p className="text-muted-foreground flex items-center gap-1 text-sm">
        Made with <Heart className="size-4 fill-current" />
        by{' '}
        <a className="hover:text-primary" href="https://lukemcdonald.com/">
          Luke McDonald
        </a>
      </p>
    </div>
  );
}
