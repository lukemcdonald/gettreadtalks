'use client';

import { useEffect } from 'react';
import NextError from 'next/error';

import { captureException } from '@/services/errors';

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
}

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    captureException(error, { level: 'fatal' });
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
