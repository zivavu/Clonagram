import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';

const chivo = localFont({
   src: '../../public/Chivo/Chivo-VariableFont_wght.ttf',
   weight: '100 900',
   variable: '--font-chivo',
   display: 'swap',
});

export const metadata: Metadata = {
   title: 'Clonagram',
   description: 'Instagram clone',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang="en" className={`${chivo.variable} ${chivo.className}`}>
         <body>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
