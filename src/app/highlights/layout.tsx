import { Grand_Hotel } from 'next/font/google';

const grandHotel = Grand_Hotel({
   weight: '400',
   subsets: ['latin'],
   variable: '--font-grand-hotel',
   display: 'swap',
});

export default function HighlightsLayout({ children }: { children: React.ReactNode }) {
   return <div className={grandHotel.variable}>{children}</div>;
}
