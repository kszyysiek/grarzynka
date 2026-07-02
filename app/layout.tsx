import type { Metadata } from 'next';
import './globals.css';
import { BRAND } from '@/data/brand';
import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';

export const metadata: Metadata = {
  title: `${BRAND} — Modulares Aluminium Lamellensystem`,
  description:
    `${BRAND} ist ein modulares System vertikaler Aluminiumlamellen für hinterlüftete Außenfassaden, Innenwände und Decken. Aluminiumguss. Entwickelt und gefertigt in Deutschland.`,
  keywords:
    'Aluminium Fassadenlamellen, Lamellenfassade, Fassadenprofile Aluminium, vertikale Fassadenlamellen, LED Fassade, Aluminiumguss Fassade, hinterlüftete Fassade',
  openGraph: {
    title: `${BRAND} — Modulares Aluminium Lamellensystem`,
    description:
      'Ein Fassadensystem für Architektur, die nicht laut sein muss, um gesehen zu werden.',
    type: 'website',
    locale: 'de_DE',
    images: ['/renders/penthouse-night.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
