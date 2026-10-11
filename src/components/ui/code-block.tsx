'use client';

import { useState } from 'react';

import { Button } from './primitives/button';

interface CodeBlockProps {
  code: string;
  copyLabel?: string;
  copyTestId?: string;
}

export function CodeBlock({
  code,
  copyLabel = 'Copy code',
  copyTestId,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const label = copied ? 'Copied' : copyLabel;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <pre className="bg-muted overflow-x-auto rounded-lg p-3 pr-20 text-sm">
        <code>{code}</code>
      </pre>
      <Button
        aria-label={label}
        className="absolute top-2 right-2"
        data-testid={copyTestId}
        onClick={handleCopy}
        size="xs"
        type="button"
        variant="outline"
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}
