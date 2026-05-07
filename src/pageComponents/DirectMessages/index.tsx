import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { AiOutlineSmile } from 'react-icons/ai';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoCallOutline, IoInformationCircleOutline, IoMicOutline } from 'react-icons/io5';
import { LuSticker } from 'react-icons/lu';
import { RiUserReceived2Line } from 'react-icons/ri';
import { TbPhoto } from 'react-icons/tb';
import { VscSend } from 'react-icons/vsc';
import { MESSAGE_THREADS } from '@/src/mocks/messageThreads';
import { formatGroupSeparator } from '@/src/utils/formatters';
import { isRequestsFolder } from '@/src/utils/server';
import { CURRENT_USER } from '../Home/data';
import { styles } from './index.stylex';
import NewMessageModal from './NewMessageModal';
import NewMessageTrigger from './NewMessageModal/NewMessageTrigger';
import RecipientsSidebar from './RecipientsSidebar/index';

interface DirectMessagesPageProps {
   chatId?: string | undefined;
}

export default async function DirectMessagesPage({ chatId }: DirectMessagesPageProps) {
   const isRequestsPage = await isRequestsFolder();

   const chat = MESSAGE_THREADS.find(u => u.id === chatId);
   const user = (chat?.participants.length && chat.participants[0]) || undefined;

   const isChatSelected = !!chatId;

   return (
      <div {...stylex.props(styles.root)}>
         <RecipientsSidebar />
         <div {...stylex.props(styles.chatContainer)}>
            {!isChatSelected && !isRequestsPage && (
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
                  <NewMessageTrigger styleProps={stylex.props(styles.sendMessageButton)}>
                     Send message
                  </NewMessageTrigger>
               </div>
            )}
            {!isChatSelected && isRequestsPage && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <RiUserReceived2Line
                        style={{
                           fontSize: '50px',
                           transform: 'scaleX(-1)',
                        }}
                     />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Message requests</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
                     These messages are from people you&apos;ve restricted or don&apos;t follow. They won&apos;t know
                     you viewed their request until you allow them to message you.
                  </div>
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
         <NewMessageModal />
      </div>
   );
}
