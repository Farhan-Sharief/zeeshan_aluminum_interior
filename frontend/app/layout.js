import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#f5f0eb',
              borderRadius: '8px',
              border: '1px solid rgba(201, 168, 76, 0.3)',
            },
            success: { iconTheme: { primary: '#c9a84c', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        {children}
      </body>
    </html>
  );
}
