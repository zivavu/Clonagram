'use client';

import * as stylex from '@stylexjs/stylex';
import AuthPagesFooter from '../../components/AuthPagesFooter';
import { colors } from '../../styles/tokens.stylex';
import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';

const styles = stylex.create({
   root: {
      width: '100%',
      minHeight: '100svh',
      height: '100svh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bg,
   },
   content: {
      flex: 1,
      display: 'flex',
      width: '100%',
   },
});

export default function LoginPage() {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.content)}>
            <LeftSection />
            <RightSection />
         </div>
         <AuthPagesFooter />
      </div>
   );
}
