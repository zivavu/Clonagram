import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';

const chivo = localFont({
   src: '../fonts/Chivo-VariableFont_wght.ttf',
   variable: '--font-auth',
   weight: '100 900',
   display: 'swap',
});

export const metadata: Metadata = {
   title: 'Clonagram',
   description: 'Instagram clone',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <>
         <SpeedInsights />
         <html lang="en" suppressHydrationWarning className={chivo.variable}>
            <body style={{ colorScheme: 'light dark'}}>
               <Providers>{children}</Providers>
            </body>
         </html>
      </>
   );
}
