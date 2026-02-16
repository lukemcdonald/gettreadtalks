import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { Inter, Playfair_Display } from 'next/font/google';

import { AnalyticsProvider } from '@/components/analytics-provider';
import { AuthProvider } from '@/components/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastProvider } from '@/components/ui/primitives/toast';

import '@/assets/styles.css';

import type { ReactNode } from 'react';

import { SkipNavLink } from '@/components/site-header/navigation/skip-nav-link';
import { cn } from '@/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  description: 'Christ centered sermons to elevate your spiritual heartbeat.',
  icons: {
    apple: '/favicon.png',
    icon: [
      { type: 'image/svg+xml', url: '/favicon.svg' },
      { type: 'image/png', url: '/favicon.png' },
    ],
  },
  metadataBase: new URL('https://gettreadtalks.com'),
  openGraph: {
    images: [{ alt: 'TREAD Talks', height: 630, url: '/default-seo-image.png', width: 1200 }],
    locale: 'en_US',
    siteName: 'TREAD Talks',
    type: 'website',
  },
  title: {
    default: 'TREAD Talks',
    template: '%s | TREAD Talks',
  },
  twitter: {
    card: 'summary_large_image',
    ...(process.env.NEXT_PUBLIC_TWITTER_HANDLE && {
      site: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
    }),
  },
};

export default async function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: ReactNode;
  sheet: ReactNode;
}>) {
  return (
    <html
      className={cn('h-full', inter.variable, playfair.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body className={'flex min-h-full flex-col bg-background bg-cover text-foreground'}>
        <AnalyticsProvider>
          <ErrorBoundary>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <SkipNavLink href="#main" />
                  <SiteHeader />
                  <div className="flex-1 py-6 sm:py-8 md:py-10 lg:py-12" id="content">
                    {children}
                  </div>
                  <SiteFooter />
                  {sheet}
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </AnalyticsProvider>
        <Analytics />
      </body>
    </html>
  );
}
