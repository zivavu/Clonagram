import * as stylex from '@stylexjs/stylex';
import { headers } from 'next/headers';
import RecipientsSidebar from './RecipientsSidebar';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: 'var(--main-sidebar-width)',
   },
});

export default async function DirectMessagesPage() {
   const headersList = await headers();
   const url = headersList.get('x-url');
   const pathname = new URL(url || '/').pathname;

   return (
      <div {...stylex.props(styles.root)}>
         <RecipientsSidebar pathname={pathname} />
      </div>
   );
}
