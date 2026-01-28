import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import Header from '@/components/header';
import { Analytics } from '@vercel/analytics/react';
import { CartProvider } from '@/context/cart-context';

export const metadata: Metadata = {
  title: 'Feline & Friend',
  description: 'Your one-stop shop for cats and pet products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </CartProvider>
        </FirebaseProvider>
        <Analytics />
      </body>
    </html>
  );
}
