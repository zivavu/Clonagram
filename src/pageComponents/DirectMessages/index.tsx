import * as stylex from '@stylexjs/stylex';
import { VscSend } from 'react-icons/vsc';
import { colors, radius } from '../../styles/tokens.stylex';
import RecipientsSidebar from './RecipientsSidebar';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      width: '100%',
      marginLeft: 'var(--main-sidebar-width)',
   },
   chatContainer: {
      width: '100%',
   },
   chatNotSelectedContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'center',
   },
   messageIconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '96px',
      height: '96px',
      borderRadius: radius.full,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: colors.textPrimary,
      marginBottom: '8px',
   },
   chatNotSelectedTitle: {
      fontSize: '1.25rem',
      color: colors.textPrimary,
      marginBottom: '-2px',
   },
   chatNotSelectedSubtitle: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
   },
   sendMessageButton: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: colors.textPrimary,
      backgroundColor: colors.accent,
      borderRadius: radius.sm,
      padding: '6px 16px',
      marginTop: '8px',
   },
});

export default async function DirectMessagesPage() {
   const isChatSelected = true;
   return (
      <div {...stylex.props(styles.root)}>
         <RecipientsSidebar />
         <div {...stylex.props(styles.chatContainer)}>
            {isChatSelected && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <VscSend
                        style={{
                           fontSize: '50px',
                           transform: 'translateY(-3px) translateX(3px) rotate(-35deg)',
                        }}
                     />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Your messages</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>Send a message to start a chat.</div>
                  <button {...stylex.props(styles.sendMessageButton)}>Send message</button>
               </div>
            )}
         </div>
      </div>
   );
}
