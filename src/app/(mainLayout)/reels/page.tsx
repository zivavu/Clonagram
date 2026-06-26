import { Suspense } from 'react';
import Reels from '@/src/pageComponents/Reels';

export default function ReelsPage() {
   return (
      <Suspense>
         <Reels />
      </Suspense>
   );
}
