import { Grand_Hotel } from 'next/font/google';
import ShareStoryModal from '@/src/components/ShareStoryModal';

const grandHotel = Grand_Hotel({
   weight: '400',
   subsets: ['latin'],
   variable: '--font-grand-hotel',
   display: 'swap',
});

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
   return (
      <div className={grandHotel.variable}>
         <ShareStoryModal />
         {children}
      </div>
   );
}
