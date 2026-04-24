import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './providers';

const chivo = localFont({
   src: [
      {
         path: '../../public/Chivo/Chivo-VariableFont_wght.ttf',
         weight: '100 900',
         style: 'normal',
      },
      {
         path: '../../public/Chivo/Chivo-Italic-VariableFont_wght.ttf',
         weight: '100 900',
         style: 'italic',
      },
   ],
   variable: '--font-chivo',
   display: 'swap',
});

export const metadata: Metadata = {
   title: 'Clonagram',
   description: 'Instagram clone',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang="en" className={chivo.variable}>
         <body>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
