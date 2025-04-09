import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Energy Monitor Dashboard',
  description: 'Smart Energy Monitor Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <main className="p-6 md:p-8 max-w-7xl mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}