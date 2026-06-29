import * as stylex from '@stylexjs/stylex';
import { RiUserReceived2Line } from 'react-icons/ri';
import { VscSend } from 'react-icons/vsc';
import { styles } from '../../index.stylex';
import NewMessageTrigger from '../NewMessageModal/NewMessageTrigger';

interface EmptyStateProps {
   variant: 'messages' | 'requests';
}

export default function EmptyState({ variant }: EmptyStateProps) {
   if (variant === 'requests') {
      return (
         <div {...stylex.props(styles.chatNotSelectedContainer)}>
            <div {...stylex.props(styles.messageIconContainer)}>
               <RiUserReceived2Line {...stylex.props(styles.requestsIcon)} />
            </div>
            <div {...stylex.props(styles.chatNotSelectedTitle)}>Message requests</div>
            <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
               These messages are from people you&apos;ve restricted or don&apos;t follow. They
               won&apos;t know you viewed their request until you allow them to message you.
            </div>
         </div>
      );
   }

   return (
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
   );
}
