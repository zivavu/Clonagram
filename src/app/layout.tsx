import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
   title: 'Clonagram',
   description: 'Instagram clone',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang="en">
         <body>
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
