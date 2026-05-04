import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoCallOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { VscSend } from 'react-icons/vsc';
import { colors, radius } from '../../styles/tokens.stylex';
import { MESSAGE_THREADS } from './messagesData';
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
   chatTopBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      paddingRight: 24,
      height: 77,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
   },
   chatTopBarRecipient: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
   },
   chatTopBarRecipientImage: {
      borderRadius: '50%',
   },
   chatTopBarRecipientName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: colors.textPrimary,
   },
   chatTopBarRecipientUsername: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
   },
   chatTopBarActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
   },
   chatTopBarActionIcon: {
      fontSize: '1.7rem',
      color: colors.textPrimary,
      cursor: 'pointer',
   },
});

interface DirectMessagesPageProps {
   chatId: string | undefined;
}

export default async function DirectMessagesPage({ chatId }: DirectMessagesPageProps) {
   const chat = MESSAGE_THREADS.find(u => u.id === chatId);
   const user = (chat?.participants.length && chat.participants[0]) || undefined;

   const isChatSelected = true;

   return (
      <div {...stylex.props(styles.root)}>
         <RecipientsSidebar />
         <div {...stylex.props(styles.chatContainer)}>
            {!isChatSelected && (
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
            {isChatSelected && user && (
               <div {...stylex.props(styles.chatTopBar)}>
                  <div {...stylex.props(styles.chatTopBarRecipient)}>
                     <Image
                        src={user?.avatarUrl}
                        alt={user?.username}
                        width={44}
                        height={44}
                        {...stylex.props(styles.chatTopBarRecipientImage)}
                     />
                     <div>
                        <div {...stylex.props(styles.chatTopBarRecipientName)}>{user?.name}</div>
                        <div {...stylex.props(styles.chatTopBarRecipientUsername)}>{user?.username}</div>
                     </div>
                  </div>
                  <div {...stylex.props(styles.chatTopBarActions)}>
                     <IoCallOutline {...stylex.props(styles.chatTopBarActionIcon)} />
                     <HiOutlineVideoCamera {...stylex.props(styles.chatTopBarActionIcon)} />
                     <IoInformationCircleOutline {...stylex.props(styles.chatTopBarActionIcon)} />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
