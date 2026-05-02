import * as stylex from '@stylexjs/stylex';
import MainSidebar from '@/src/components/MainSidebar/MainSidebar';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      backgroundColor: colors.bg,
   },
});

export default async function RootTemplate({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div {...stylex.props(styles.root)}>
         <MainSidebar />
         {children}
      </div>
   );
}
