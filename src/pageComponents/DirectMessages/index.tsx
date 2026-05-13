import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { AiOutlineSmile } from 'react-icons/ai';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoCallOutline, IoInformationCircleOutline, IoMicOutline } from 'react-icons/io5';
import { LuSticker } from 'react-icons/lu';
import { RiUserReceived2Line } from 'react-icons/ri';
import { TbPhoto } from 'react-icons/tb';
import { VscSend } from 'react-icons/vsc';
import UserAvatar from '@/src/components/UserAvatar';
import { MESSAGE_THREADS } from '@/src/mocks/messageThreads';
import { CURRENT_USER } from '@/src/mocks/users';
import { formatGroupSeparator } from '@/src/utils/formatters';
import NewMessageModal from './components/NewMessageModal';
import NewMessageTrigger from './components/NewMessageModal/NewMessageTrigger';
import RecipientsSidebar from './components/RecipientsSidebar/index';
import { styles } from './index.stylex';

interface DirectMessagesPageProps {
   chatId?: string | undefined;
   isRequestsPage?: boolean;
   currentFolderHref?: string;
}

export default async function DirectMessagesPage({
   chatId,
   isRequestsPage = false,
   currentFolderHref = '/direct',
}: DirectMessagesPageProps) {
   const chat = MESSAGE_THREADS.find(u => u.id === chatId);
   const user = chat?.participants[0];

   const isChatSelected = !!chatId;
   const isRequestChat = currentFolderHref === '/direct/requests' && isChatSelected;

   return (
      <div {...stylex.props(styles.root)}>
         <RecipientsSidebar currentFolderHref={currentFolderHref} isRequestsPage={isRequestsPage} />
         <div {...stylex.props(styles.chatContainer)}>
            {!isChatSelected && !isRequestsPage && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <VscSend {...stylex.props(styles.messageIcon)} />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Your messages</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
                     Send a message to start a chat.
                  </div>
                  <NewMessageTrigger styleProps={stylex.props(styles.sendMessageButton)}>
                     Send message
                  </NewMessageTrigger>
               </div>
            )}
            {!isChatSelected && isRequestsPage && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <RiUserReceived2Line {...stylex.props(styles.requestsIcon)} />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Message requests</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
                     These messages are from people you&apos;ve restricted or don&apos;t follow.
                     They won&apos;t know you viewed their request until you allow them to message
                     you.
                  </div>
               </div>
            )}
            {isChatSelected && user && chat && (
               <>
                  <div {...stylex.props(styles.chatTopBar)}>
                     <div {...stylex.props(styles.chatTopBarRecipient)}>
                        <UserAvatar src={user?.avatar_url} alt={user?.username || ''} size={44} />
                        <div>
                           <div {...stylex.props(styles.chatTopBarRecipientName)}>
                              {user?.full_name}
                           </div>
                           <div {...stylex.props(styles.chatTopBarRecipientUsername)}>
                              {user?.username}
                           </div>
                        </div>
                     </div>
                     <div {...stylex.props(styles.chatTopBarActions)}>
                        <IoCallOutline {...stylex.props(styles.chatTopBarActionIcon)} />
                        <HiOutlineVideoCamera {...stylex.props(styles.chatTopBarActionIcon)} />
                        <IoInformationCircleOutline
                           {...stylex.props(styles.chatTopBarActionIcon)}
                        />
                     </div>
                  </div>

                  <div {...stylex.props(styles.messagesContainer)}>
                     <div {...stylex.props(styles.chatProfileHeader)}>
                        <UserAvatar src={user.avatar_url} alt={user.username} size={96} />
                        <div {...stylex.props(styles.chatProfileUsername)}>{user.username}</div>
                        <div {...stylex.props(styles.chatProfileSubtitle)}>Instagram</div>
                        <button {...stylex.props(styles.chatProfileButton)}>View profile</button>
                     </div>

                     {chat.messages.map((msg, idx) => {
                        const isSent = msg.senderId === CURRENT_USER.id;
                        const prevMsg = idx > 0 ? chat.messages[idx - 1] : null;
                        const nextMsg =
                           idx < chat.messages.length - 1 ? chat.messages[idx + 1] : null;
                        const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
                        const MS_PER_DAY = 86_400_000;
                        const gapToPrev = prevMsg
                           ? new Date(msg.timestamp).getTime() -
                             new Date(prevMsg.timestamp).getTime()
                           : Infinity;
                        const showSeparator = gapToPrev > MS_PER_DAY;

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
                                          <UserAvatar
                                             src={user.avatar_url}
                                             alt={user.username}
                                             size={28}
                                          />
                                       )}
                                    </div>
                                 )}
                                 <div
                                    {...stylex.props(
                                       styles.messageBubble,
                                       isSent
                                          ? styles.messageBubbleSent
                                          : styles.messageBubbleReceived,
                                    )}
                                 >
                                    {msg.text}
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {isRequestChat ? (
                     <div {...stylex.props(styles.requestActionsContainer)}>
                        <div {...stylex.props(styles.requestInfoSection)}>
                           <div {...stylex.props(styles.requestInfoTitle)}>
                              Accept message request from{' '}
                              <span {...stylex.props(styles.requestInfoUsername)}>
                                 {user.username}
                              </span>{' '}
                              <span {...stylex.props(styles.requestInfoUsername)}>
                                 ({user.username})
                              </span>
                              ?
                           </div>
                           <div {...stylex.props(styles.requestInfoSubtitle)}>
                              If you accept, they will also be able to call you and see info such as
                              your activity status and when you&apos;ve read messages.
                           </div>
                        </div>
                        <div {...stylex.props(styles.requestButtonsRow)}>
                           <button {...stylex.props(styles.requestButton)} type="button">
                              Block
                           </button>
                           <Separator {...stylex.props(styles.requestButtonDivider)} />

                           <button
                              {...stylex.props(styles.requestButton, styles.requestButtonDanger)}
                              type="button"
                           >
                              Delete
                           </button>
                           <Separator {...stylex.props(styles.requestButtonDivider)} />

                           <button {...stylex.props(styles.requestButton)} type="button">
                              Accept
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div {...stylex.props(styles.inputContainer)}>
                        <div {...stylex.props(styles.inputWrapper)}>
                           <AiOutlineSmile {...stylex.props(styles.inputIcon)} />
                           <input
                              {...stylex.props(styles.inputField)}
                              type="text"
                              placeholder="Message..."
                           />
                           <IoMicOutline {...stylex.props(styles.inputIcon)} />
                           <TbPhoto {...stylex.props(styles.inputIcon)} />
                           <LuSticker {...stylex.props(styles.inputIcon)} />
                        </div>
                     </div>
                  )}
               </>
            )}
         </div>
         <NewMessageModal />
      </div>
   );
}
