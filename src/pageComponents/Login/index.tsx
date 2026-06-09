'use client';

import * as stylex from '@stylexjs/stylex';
import { use } from 'react';
import AuthPagesFooter from '../../components/AuthPagesFooter';
import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';
import { styles } from './index.stylex';

interface LoginPageProps {
   searchParams: Promise<{ reset?: string; error?: string }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
   const params = use(searchParams);

   return (
      <div {...stylex.props(styles.root)}>
         <main {...stylex.props(styles.content)}>
            <LeftSection />
            <RightSection initialReset={params.reset === 'true'} initialError={params.error} />
         </main>
         <AuthPagesFooter />
      </div>
   );
}
