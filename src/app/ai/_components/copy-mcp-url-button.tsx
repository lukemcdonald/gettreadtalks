'use client';

import { useState } from 'react';

import { Button } from '@/components/ui';

interface CopyMcpUrlButtonProps {
  url: string;
}

export function CopyMcpUrlButton({ url }: CopyMcpUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      data-testid="copy-mcp-url"
      onClick={handleCopy}
      size="sm"
      type="button"
      variant="outline"
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
