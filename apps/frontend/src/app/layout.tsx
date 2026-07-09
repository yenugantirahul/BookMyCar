import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'BookMyCar — Find Your Perfect Ride',
  description: 'Browse and book from our fleet of premium vehicles. Easy booking, flexible plans.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={cn("font-sans antialiased", geist.variable)}>
        <body className="min-h-screen bg-white text-slate-900">
          <Providers>
            <Navbar />
            <main className="min-h-[calc(100vh-64px)]">{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
