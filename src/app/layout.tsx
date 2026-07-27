import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OUSL Law Student Portal',
  description: 'The official portal for OUSL Law Students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-background text-text min-h-screen">
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
