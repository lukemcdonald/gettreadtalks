import { ExternalLinkIcon } from 'lucide-react';

interface ExternalLinkButtonProps {
  href: string;
}

export function ExternalLinkButton({ href }: ExternalLinkButtonProps) {
  return (
    <div className="rounded-lg border bg-muted/50 p-6 text-center">
      <a
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ExternalLinkIcon className="h-4 w-4" />
        Open Media
      </a>
    </div>
  );
}
