import * as stylex from '@stylexjs/stylex';
import { MdHistory } from 'react-icons/md';
import { colors } from '../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

export default function EmptyState() {
   return (
      <div {...stylex.props(styles.root)}>
         <MdHistory size={64} color={colors.textPrimary} />
         <h2 {...stylex.props(styles.title)}>Add to your story</h2>
         <p {...stylex.props(styles.description)}>
            Keep your stories in your archive after they disappear, so you can look back on your
            memories. Only you can see what&apos;s in your archive.
         </p>
      </div>
   );
}
