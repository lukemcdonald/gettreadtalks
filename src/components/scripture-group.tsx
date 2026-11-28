import { ExternalLinkIcon } from 'lucide-react';

import { MetadataGroup } from '@/components/metadata-group';
import { Link } from '@/components/ui/link';

export function ScriptureGroup({ scripture }: { scripture?: string }) {
  if (!scripture) {
    return null;
  }

  return (
    <MetadataGroup label="Scripture">
      <Link
        className="bg-muted text-foreground hover:bg-muted/80 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors"
        href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(scripture)}&version=ESV`}
        target="_blank"
      >
        {scripture}
        <ExternalLinkIcon className="size-3.5" />
      </Link>
    </MetadataGroup>
  );
}
