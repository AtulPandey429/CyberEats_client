import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { ApiStatusBanner } from '@/components/ApiStatusBanner';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
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
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <QueryClientProvider>
          <StoreProvider>
            <AppToastProvider>
              <ThemeProvider>
                <ApiStatusBanner />
                <Navbar />
                <main className="min-h-screen flex-1">{children}</main>
                <BottomNav />
              </ThemeProvider>
            </AppToastProvider>
          </StoreProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
