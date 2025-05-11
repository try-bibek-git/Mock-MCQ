import type {Metadata} from 'next';
import {Geist} from 'next/font/google'; // Keep Geist Sans, remove Geist Mono if not used
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/app-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PDFPrep - AI Powered Test Preparation',
  description: 'Generate MCQs and Mock Tests from your PDF documents using AI.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}