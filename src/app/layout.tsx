import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cookies } from 'next/headers';
import { darkClass } from '@/src/lib/theme';
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

export const viewport = {
   width: 'device-width',
   initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   const cookieStore = await cookies();
   const theme = cookieStore.get('theme')?.value;
   const isDark = theme === 'dark' || theme === undefined;
   const htmlClass = [chivo.variable, isDark ? darkClass : ''].filter(Boolean).join(' ');

   return (
      <>
         <SpeedInsights />
         <html lang="en" className={htmlClass}>
            <body style={{ backgroundColor: isDark ? 'rgb(12, 16, 20)' : 'rgb(255, 255, 255)' }}>
               <script
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for blocking theme script before first paint
                  dangerouslySetInnerHTML={{
                     __html: `
                        (function() {
                           const theme = document.cookie.match(/theme=(dark|light)/)?.[1];
                           const isDark = theme === 'dark' || theme === undefined;
                           const classes = '${darkClass.replace(/'/g, "\\'")}'.split(' ');
                           classes.forEach(function(c) {
                              if (c) document.documentElement.classList.toggle(c, isDark);
                           });
                        })();
                     `,
                  }}
               />
               <Providers>{children}</Providers>
            </body>
         </html>
      </>
   );
}
