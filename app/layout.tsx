import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NavigationProgress } from '@/components/NavigationProgress';
import { AppHeader } from '@/components/layout/AppHeader';
import { MainContent } from '@/components/layout/MainContent';
import { BottomNav } from '@/components/BottomNav';
import { CartDrawerLazy } from '@/components/CartDrawerLazy';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { SessionHydrator } from '@/providers/SessionHydrator';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ThemeScript } from '@/components/ThemeScript';
import { AppToastProvider } from '@/providers/ToastProvider';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CyberEats — Cyberpunk Food Delivery',
  description: 'Decentralized food delivery marketplace with Stellar payments and drone logistics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full dark`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full antialiased">
        <QueryClientProvider>
          <StoreProvider>
            <SessionHydrator />
            <AppToastProvider>
              <ThemeProvider>
                <NavigationProgress />
                <AppHeader />
                <MainContent>{children}</MainContent>
                <CartDrawerLazy />
                <BottomNav />
              </ThemeProvider>
            </AppToastProvider>
          </StoreProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
