import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Analytics } from '@vercel/analytics/next';
import { Inter } from 'next/font/google';

import { AnalyticsProvider } from '@/components/analytics-provider';
import { AuthProvider } from '@/components/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SkipNavLink } from '@/components/site-header/navigation/skip-nav-link';
import { ThemeProvider } from '@/components/theme-provider';
import '@/assets/styles.css';
import { ToastProvider } from '@/components/ui/primitives/toast';
import { site } from '@/configs/site';
import { TranscriptFetchToasts } from '@/features/talks/components/transcript-fetch-toasts';
import { WebMcpTools } from '@/features/webmcp/components/webmcp-tools';
import { cn } from '@/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  alternates: {
    canonical: './',
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    images: [
      {
        alt: site.name,
        height: 630,
        url: '/default-seo-image.png',
        width: 1200,
      },
    ],
    locale: site.locale,
    siteName: site.name,
    type: 'website',
  },
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: site.themeColor.light, media: '(prefers-color-scheme: light)' },
    { color: site.themeColor.dark, media: '(prefers-color-scheme: dark)' },
  ],
};

export default function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: ReactNode;
  sheet: ReactNode;
}>) {
  return (
    <html
      className={cn('h-full', inter.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground flex min-h-full flex-col bg-cover">
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <AnalyticsProvider>
                <ToastProvider>
                  <TranscriptFetchToasts />
                  <SkipNavLink href="#main" />
                  <SiteHeader />
                  <div
                    className="flex-1 py-6 sm:py-8 md:py-10 lg:py-12"
                    id="content"
                  >
                    {children}
                  </div>
                  <SiteFooter />
                  {sheet}
                </ToastProvider>
              </AnalyticsProvider>
              <WebMcpTools />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics debug={false} />
      </body>
    </html>
  );
}
