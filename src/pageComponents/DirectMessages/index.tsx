import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { AiOutlineSmile } from 'react-icons/ai';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoCallOutline, IoInformationCircleOutline, IoMicOutline } from 'react-icons/io5';
import { LuSticker } from 'react-icons/lu';
import { TbPhoto } from 'react-icons/tb';
import { VscSend } from 'react-icons/vsc';
import { colors, radius } from '../../styles/tokens.stylex';
import { CURRENT_USER } from '../Home/data';
import { formatGroupSeparator, MESSAGE_THREADS } from './messagesData';
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
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
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
   messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '24px 16px',
   },
   chatProfileHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '16px 0 24px',
   },
   chatProfileAvatar: {
      borderRadius: radius.full,
      marginBottom: '8px',
   },
   chatProfileUsername: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: colors.textPrimary,
   },
   chatProfileSubtitle: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
   },
   chatProfileButton: {
      marginTop: '12px',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: colors.textPrimary,
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.sm,
      padding: '7px 16px',
   },
   dateSeparator: {
      textAlign: 'center',
      margin: '16px 0',
      width: '100%',
   },
   dateSeparatorText: {
      fontSize: '0.75rem',
      fontWeight: 300,
      color: colors.textSecondary,
   },
   messageRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '8px',
      maxWidth: '70%',
   },
   messageRowSent: {
      alignSelf: 'flex-end',
   },
   messageRowReceived: {
      alignSelf: 'flex-start',
   },
   messageAvatarSlot: {
      width: '28px',
      height: '28px',
      flexShrink: 0,
   },
   messageAvatar: {
      borderRadius: '50%',
      flexShrink: 0,
   },
   messageBubble: {
      padding: '10px 14px',
      fontSize: '0.875rem',
      lineHeight: '1.3',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
   },
   messageBubbleSent: {
      backgroundColor: colors.accent,
      color: '#fff',
      borderRadius: radius.xl,
   },
   messageBubbleReceived: {
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      borderRadius: radius.xl,
   },
   inputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 20px',
   },
   inputWrapper: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderStyle: 'solid',
      borderColor: 'rgb(54, 54, 54)',
      borderWidth: 1,
      borderRadius: radius.full,
      padding: '0 16px',
   },
   inputField: {
      flex: 1,
      borderWidth: 0,
      outline: 'none',
      backgroundColor: 'transparent',
      fontSize: '0.9375rem',
      color: colors.textPrimary,
      padding: '12px 0',
      '::placeholder': {
         color: colors.textSecondary,
      },
   },
   inputIcon: {
      fontSize: '1.6rem',
      cursor: 'pointer',
   },
});

interface DirectMessagesPageProps {
   chatId?: string | undefined;
}

export default async function DirectMessagesPage({ chatId }: DirectMessagesPageProps) {
   const chat = MESSAGE_THREADS.find(u => u.id === chatId);
   const user = (chat?.participants.length && chat.participants[0]) || undefined;

   const isChatSelected = !!chatId;

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
            {isChatSelected && user && chat && (
               <>
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

                  <div {...stylex.props(styles.messagesContainer)}>
                     <div {...stylex.props(styles.chatProfileHeader)}>
                        <Image
                           src={user.avatarUrl}
                           alt={user.username}
                           width={96}
                           height={96}
                           {...stylex.props(styles.chatProfileAvatar)}
                        />
                        <div {...stylex.props(styles.chatProfileUsername)}>{user.username}</div>
                        <div {...stylex.props(styles.chatProfileSubtitle)}>Instagram</div>
                        <button {...stylex.props(styles.chatProfileButton)}>View profile</button>
                     </div>

                     {chat.messages.map((msg, idx) => {
                        const isSent = msg.senderId === CURRENT_USER.id;
                        const prevMsg = idx > 0 ? chat.messages[idx - 1] : null;
                        const nextMsg = idx < chat.messages.length - 1 ? chat.messages[idx + 1] : null;
                        const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
                        const gapToPrev = prevMsg
                           ? new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()
                           : Infinity;
                        const showSeparator = gapToPrev > 24 * 60 * 60 * 1000;

                        return (
                           <div key={msg.id} style={{ display: 'contents' }}>
                              {showSeparator && (
                                 <div {...stylex.props(styles.dateSeparator)}>
                                    <span {...stylex.props(styles.dateSeparatorText)}>
                                       {formatGroupSeparator(msg.timestamp)}
                                    </span>
                                 </div>
                              )}
                              <div
                                 {...stylex.props(
                                    styles.messageRow,
                                    isSent ? styles.messageRowSent : styles.messageRowReceived,
                                 )}
                              >
                                 {!isSent && (
                                    <div {...stylex.props(styles.messageAvatarSlot)}>
                                       {isLastInGroup && (
                                          <Image
                                             src={user.avatarUrl}
                                             alt={user.username}
                                             width={28}
                                             height={28}
                                             {...stylex.props(styles.messageAvatar)}
                                          />
                                       )}
                                    </div>
                                 )}
                                 <div
                                    {...stylex.props(
                                       styles.messageBubble,
                                       isSent ? styles.messageBubbleSent : styles.messageBubbleReceived,
                                    )}
                                 >
                                    {msg.text}
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <div {...stylex.props(styles.inputContainer)}>
                     <div {...stylex.props(styles.inputWrapper)}>
                        <AiOutlineSmile {...stylex.props(styles.inputIcon)} />
                        <input {...stylex.props(styles.inputField)} type="text" placeholder="Message..." />
                        <IoMicOutline {...stylex.props(styles.inputIcon)} />
                        <TbPhoto {...stylex.props(styles.inputIcon)} />
                        <LuSticker {...stylex.props(styles.inputIcon)} />
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
