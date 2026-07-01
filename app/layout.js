import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ToasterProvider from '@/components/ToasterProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata = {
  title: 'Zeeshan Aluminum Interior | Premium Aluminum & Interior Solutions',
  description: 'Transform your spaces with premium aluminum fabrication, TV cabinets, modular interiors, and custom design solutions. Expert craftsmanship with modern design excellence.',
  keywords: 'aluminum work, interior design, TV cabinet design, modular interiors, custom furniture, aluminum fabrication, false ceiling, kitchen interiors',
  openGraph: {
    title: 'Zeeshan Aluminum Interior | Premium Aluminum & Interior Solutions',
    description: 'Transform your spaces with premium aluminum fabrication, TV cabinets, modular interiors, and custom design solutions.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Zeeshan Aluminum Interior',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
