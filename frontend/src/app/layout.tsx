import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { QueryProvider } from '@/components/shared/query-provider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Papikondalu Tourism - Boat Tours & Adventures',
    template: '%s | Papikondalu Tourism',
  },
  description: 'Experience the majestic Papikondalu hills and Godavari river with our premium boat tours and adventure packages. Book your dream trip today!',
  keywords: ['Papikondalu', 'Godavari', 'boat tour', 'tourism', 'Rajahmundry', 'adventure', 'travel'],
  authors: [{ name: 'Papikondalu Tourism' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://papikondalu.com',
    siteName: 'Papikondalu Tourism',
    title: 'Papikondalu Tourism - Boat Tours & Adventures',
    description: 'Experience the majestic Papikondalu hills and Godavari river with our premium boat tours.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papikondalu Tourism',
    description: 'Experience the beauty of Godavari with our premium tours.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { background: 'hsl(var(--card))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))' },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
