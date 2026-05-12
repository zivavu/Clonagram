'use client';

import * as stylex from '@stylexjs/stylex';
import AuthPagesFooter from '../../components/AuthPagesFooter';
import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';
import { styles } from './index.stylex';

export default function LoginPage() {
   return (
      <div {...stylex.props(styles.root)}>
         <main {...stylex.props(styles.content)}>
            <LeftSection />
            <RightSection />
         </main>
         <AuthPagesFooter />
      </div>
   );
}
