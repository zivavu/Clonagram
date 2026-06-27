'use client';

import * as stylex from '@stylexjs/stylex';
import { useSearchParams } from 'next/navigation';
import AuthPagesFooter from '../../components/AuthPagesFooter';
import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';
import { styles } from './index.stylex';

export default function LoginPage() {
   const searchParams = useSearchParams();

   return (
      <div {...stylex.props(styles.root)}>
         <main {...stylex.props(styles.content)}>
            <LeftSection />
            <RightSection
               initialReset={searchParams.get('reset') === 'true'}
               initialError={searchParams.get('error') ?? undefined}
            />
         </main>
         <AuthPagesFooter />
      </div>
   );
}
