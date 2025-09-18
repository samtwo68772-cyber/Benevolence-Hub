
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Alegreya, Belleza } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Benevolence Hub - Compassion in Action',
  description: 'Join Benevolence Hub in our mission to bring hope and support to communities in need through impactful humanitarian projects.',
  icons: {
    icon: "/favicon.ico",
  },
};

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const belleza = Belleza({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-headline',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${alegreya.variable} ${belleza.variable} scroll-smooth`}>
      <head/>
      <body className="font-body bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
